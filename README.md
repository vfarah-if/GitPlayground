# Sample Client Connections

Transport for London have created an endpoint that returns an abundance of data without options to paginate, filter, sort or cache data. 

This is an opportunity to create a client that could do all of this through whatever mechanisms you chose. Remember to test 
drive your solution and create simple elegant solutions that describe simply what they achieve.

1. Create a domain to represent to client connections
2. Create a unit test to drive the development
3. Create an acceptance test that simply utilises all the methods, try not to do too much or the account will be locked with a denial of service attack, keep the acceptance test to a minimum
4. Create a simple console application that will help test the logic by example and output some meaningful data

Extra measures can be taken if there is time or interest permits
1. Create a web Api that allows this to be done through an Api outputting the information through this proxy
2. Create a web client that will load this information on a google or Bing map. Start with simply generating an observable on the data and extend it to being viewed on a map

# Things to do myself
For me this is a Playground for testing rest connections, Flurl, Bddfy and other concepts
TODO: Create a .net core or web Api to call cached and paged client for London transport
TODO: Create an angular 6 client to look at severity data within google map 
TODO: Create a react client doing the same thing to compare and do it in typescript
