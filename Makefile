.PHONY: create-droplet login 

create-droplet: 
	docker-machine create --driver digitalocean --digitalocean-access-token=$$DIGITAL_OCEAN_ACCESS_TOKEN --digitalocean-size 1gb --digitalocean-region lon1 image-server

login:
	eval $(docker-machine env image-server)

