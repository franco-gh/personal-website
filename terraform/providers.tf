terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
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

  # Remote backend for state management
  # Uncomment and configure when setting up CI/CD
  # backend "azurerm" {
  #   resource_group_name  = "terraform-state-rg"
  #   storage_account_name = "tfstate[random-suffix]"
  #   container_name       = "tfstate"
  #   key                  = "website.tfstate"
  # }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}