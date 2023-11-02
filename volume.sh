#!/bin/bash

gcloud container clusters get-credentials mycluster --zone us-east4-c
kubectl apply -f volume.yaml