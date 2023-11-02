provider "google" {
  credentials = file("./red-alloy-390215-3c6f737ad010.json")
  project     = "red-alloy-390215"
  region      = "us-east4"
}

resource "google_container_cluster" "primary" {
  name               = "mycluster"
  location           = "us-east4-c"
  remove_default_node_pool = true
	initial_node_count       = 1
}

resource "google_container_node_pool" "primary_nodes" {
		name = "mynode"
		location = "us-east4-c"
		cluster = google_container_cluster.primary.name
		node_count = 1

  node_config {
      machine_type = "e2-medium"
      disk_size_gb = 10
      disk_type    = "pd-standard"
      image_type   = "COS_CONTAINERD"
   }

   provisioner "local-exec" {
    command = "./volume.sh"
  }
}
