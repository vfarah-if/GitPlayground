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
TODO: Owin web Api to call cached and paged client for London transport and create as simple as possible an own console application that can utilise good simple patterns to test and develop each area
https://docs.microsoft.com/en-us/aspnet/web-api/overview/hosting-aspnet-web-api/use-owin-to-self-host-web-api

https://autofaccn.readthedocs.io/en/latest/integration/owin.html

https://github.com/domaindrivendev/Swashbuckle

https://docs.microsoft.com/en-us/aspnet/visual-studio/overview/2013/release-notes#TOC11

https://docs.microsoft.com/en-us/aspnet/web-api/overview/advanced/configuring-aspnet-web-api#webhost

https://docs.microsoft.com/en-us/aspnet/web-api/overview/security/enabling-cross-origin-requests-in-web-api
	Finish unit tests
	Extend tests to test header values and other controller information
	Extends with swagger, pact or typemock tests
	Fix RFC3986-compliant issues

Add caching in teh web api 2 layer (Take a look)
	https://github.com/filipw/Strathweb.CacheOutput

TODO: Create an angular 7 client to look at severity data within google map 

https://github.com/angular/angular-cli/wiki

https://alligator.io/angular/testing-httpclient/



Start coming up with ideas for lightning talks

TODO: Create a react client doing the same thing to compare and do it in typescript
	
	Follow the instructions for generating the base typescript project https://github.com/Microsoft/TypeScript-React-Starter



