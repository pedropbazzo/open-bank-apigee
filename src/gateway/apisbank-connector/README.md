The apisbank-connector is used to connect from any Apigee organization to Apigee Openbank datatsore instance. It provides the replacement for all southbound proxies when users do not have Google Cloud Datastore instance available for deploying OpenBank solution. 

When users don't have Datastore instance, they can still deploy the OpenBank solution by using apisbank-connector as a single southbound proxy for all northbound proxies, which connect to Interface for Apigee's Openbank Datastore