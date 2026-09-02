import { TopologyNodeData, TopologyEdgeData } from '../types/topology';
import { CLOUD_REGIONS, RESOURCE_SKUS } from '../data/catalog';

export function generateTerraformHCL(
  nodes: Array<{ id: string; data: TopologyNodeData }>,
  edges: Array<{ id: string; source: string; target: string; data?: TopologyEdgeData }>
): string {
  const providersSet = new Set(nodes.map(n => n.data.provider));
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  let hcl = `################################################################################
# CloudTopology CPQ: Generated Multi-Cloud Terraform Infrastructure Code
# Generated: ${new Date().toISOString()}
# Total Nodes: ${nodes.length} | Interconnect Edges: ${edges.length}
################################################################################

terraform {
  required_version = ">= 1.5.0"
  required_providers {
`;

  if (providersSet.has('aws')) {
    hcl += `    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }\n`;
  }
  if (providersSet.has('gcp')) {
    hcl += `    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }\n`;
  }
  if (providersSet.has('azure')) {
    hcl += `    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }\n`;
  }
  if (providersSet.has('cloudflare')) {
    hcl += `    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }\n`;
  }

  hcl += `  }
}

# --- Cloud Provider Configurations ---
`;

  if (providersSet.has('aws')) {
    hcl += `provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      ManagedBy = "CloudTopology-CPQ"
      Environment = "Production"
    }
  }
}\n\n`;
  }

  if (providersSet.has('cloudflare')) {
    hcl += `provider "cloudflare" {
  # api_token sourced from CLOUDFLARE_API_TOKEN environment variable
}\n\n`;
  }

  hcl += `# --- Visual Topology Node Resources ---\n\n`;

  for (const node of nodes) {
    const data = node.data;
    const cleanId = node.id.replace(/[^a-zA-Z0-9_]/g, '_');
    const region = CLOUD_REGIONS[data.regionId];
    const sku = RESOURCE_SKUS.find(s => s.id === data.skuId);

    if (data.serviceType === 'compute' && data.provider === 'aws') {
      const instanceType = sku?.id.includes('t4g') ? 't4g.xlarge' : sku?.id.includes('c6i') ? 'c6i.2xlarge' : 'm6i.4xlarge';
      hcl += `# Compute: ${data.label} (${region?.name || data.regionId})
resource "aws_instance" "${cleanId}" {
  ami           = "ami-0c7217cdde317cfec" # Amazon Linux 2023 Graviton/x86
  instance_type = "${instanceType}"
  count         = ${data.instances || 1}

  tags = {
    Name        = "${data.label}"
    Region      = "${region?.id || data.regionId}"
    FinOpsTier  = "${data.pricingTier}"
  }
}\n\n`;
    } else if (data.serviceType === 'database' && data.provider === 'aws') {
      hcl += `# Aurora Database Cluster: ${data.label}
resource "aws_rds_cluster" "${cleanId}" {
  cluster_identifier      = "${cleanId.toLowerCase()}-cluster"
  engine                  = "aurora-postgresql"
  engine_version          = "16.1"
  database_name           = "production_db"
  master_username         = "adminuser"
  manage_master_user_password = true

  serverlessv2_scaling_configuration {
    max_capacity = 16.0
    min_capacity = 2.0
  }

  tags = {
    Name     = "${data.label}"
    PIIScope = "${data.isPII ? 'EU_GDPR_RESTRICTED' : 'PUBLIC'}"
  }
}\n\n`;
    } else if (data.serviceType === 'storage' && data.provider === 'aws') {
      hcl += `# S3 Storage Bucket: ${data.label}
resource "aws_s3_bucket" "${cleanId}" {
  bucket = "${cleanId.toLowerCase()}-store"

  tags = {
    Name       = "${data.label}"
    StorageCap = "${data.allocatedStorageGb || 1000}GB"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "${cleanId}_enc" {
  bucket = aws_s3_bucket.${cleanId}.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}\n\n`;
    } else if (data.serviceType === 'cdn_edge' && data.provider === 'cloudflare') {
      hcl += `# Cloudflare Edge Worker & Cache: ${data.label}
resource "cloudflare_worker_script" "${cleanId}" {
  account_id = var.cloudflare_account_id
  name       = "${cleanId.toLowerCase()}-edge-router"
  content    = file("edge_router.js")
  module     = true
}

resource "cloudflare_worker_route" "${cleanId}_route" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "*example.com/api/*"
  script_name = cloudflare_worker_script.${cleanId}.name
}\n\n`;
    }
  }

  hcl += `# --- Inter-Region Network Connections & Peering ---\n\n`;

  for (const edge of edges) {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    if (!sourceNode || !targetNode) continue;

    const edgeCleanId = `peering_${edge.source.replace(/[^a-zA-Z0-9_]/g, '_')}_to_${edge.target.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    const connType = edge.data?.connectionType || 'internet';

    if (connType === 'vpc_peering') {
      hcl += `# Inter-VPC Peering: ${sourceNode.data.label} -> ${targetNode.data.label}
resource "aws_vpc_peering_connection" "${edgeCleanId}" {
  peer_vpc_id = "vpc-0123456789abcdef0"
  vpc_id      = "vpc-0abcdef0123456789"
  auto_accept = true

  tags = {
    Name            = "${edgeCleanId}"
    TransferBandwidth = "${edge.data?.monthlyTransferGb || 1000}GB/mo"
  }
}\n\n`;
    }
  }

  return hcl;
}
