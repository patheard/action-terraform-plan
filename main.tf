terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.46"
    }
  }

  required_version = ">= 1.0.0"
}

provider "aws" {
  region = "us-east-1"
}