terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }
  }

  # Terraform Cloud backend for state management
  cloud {
    organization = "CUM"
    
    workspaces {
      name = "personal-website"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}
#triggering