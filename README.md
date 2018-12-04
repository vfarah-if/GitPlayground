# Welcome to your first indaba
So you may be asking what is an indaba? As a native South African, I have often used this term out of context, but appropriatly to do with what this site is about. 

Officially it is an important meeting or conference held by the Zulu or Xhosa people. However we SOuth African's overload this by saying "that is your Indaba my brew", meaning you should solve it or run it the way you want to.

So what does this have to do with the Git Playground? This is a series of real-world Indabas, or soon to become, and for you that is about chosing how you solve these indabas. Essentially the gist of it is below and if you are interested in how it is solved by me, look at my indaba src within the repository.  

# Transport For London Indaba

Transport for London have created an endpoint that returns an abundance of data without options to paginate, filter, sort or cache data. You can see more about this api here within the[api.tfl.gov.uk](https://api.tfl.gov.uk/swagger/ui/index.html?url=/swagger/docs/v1#!/AccidentStats/AccidentStats_Get)

This Api is a great way to see what you should not do when creating an Api. Now I was trying to find out some statistics about my cycle route from home, to work out where I should cycle and what roads I should avoid. This Api did not help me in the slightest and returned almost 49000 records per year, with no option to query the data or search over several years. I thought this is a wonderful chance to create a full stack, partial solution depending on which Indaba you want to follow.

This is an opportunity to create a client that could do all of this through whatever mechanisms you chose. Remember to test 
drive your solution and if you are going to follow anything, KISS is the only things that should be done with the best of intentions.

## Domain indaba
1. Create a domain to represent facilitate any core domain logic or domain models to serialize the data within.
2. Create a unit test to drive the development of the specific class, mocking any dependencies where possible.
3. Create an acceptance test that simply tests the full stack with anything you want to define as a requirement, try not to do too much with the TFL Api or you will be locked out of the site with a denial of service attack, which may come about with fast paced tests firing at the server rapidly making AWS think you are attacking the site. So where possible follow a traditional test pyramid and keep the acceptance test to a minimum, ideally driving outside-in with tests until you have a final solution.
4. Create a simple console application that will consume the domain and show some specific data like fatal accidents between a period of time, cyclign deaths since the beginning of time.
5 There are a few constraints that need to be adhered to. There is only data between 2004 and the last year. I am not sure when 2018 data will be available but your logic should cater querying last year data as the max.

## Database indaba
1. Using a database of your choice, represent the accident artifacts and seed the data from the live site into the database.
2. The database must be setup migrations as well as seeding the data on the first run of the system. Add a *README* to help describe what needs to be done. 
3. Create a readonly repository repsonsible for reading the data. 

## Api indaba
1. Recreate the Api allowing for options to query host the data. You need to use the domain to show data and so any caching or optimisations need to be configured through the Api. Remember this needs to be able to run through a browser or postman so allow for a simple and intuitive user experience. 
2. Create two versions possibly that use the live site data and possibly your own data. 

## Front-end indaba
1. You may need to create an Api to host the query mechanism, see the Api indaba for more information
2. Create several components allowing different views on the data liek a query component, or a map component or a list component describing the accidents between a certain data by a certain severity

## Study indaba
Do not look at this if you want to solve this on your own. This is my indaba and will explain roughly how I chose to solve this problem

### Set up development environments

1. This assumes you have visual studio or use visual studio 2017 and up. The solution used .Net framework 4.6.2 but I could have easily done this in .net core, just chose to do it this way as I was testing FLURL and Bddfy for a project that was not using .net core and so I continued down this route.
	1. Download the git source
	2. Open *GitPlayground.sln* with visual studio
	3. **NOTE:** some of the tests will need to be fixed because they rely on live data and your environment may be synchronised differently, or possibly not setup. The TFL sight has dynamic data, mainly two versions of the data depending on the load balancer you hit. I have created tests that will be easy to repair json data using your locally configured compare tool and when the compare fails for difference, just synchronise what is on your local setup. 
	4. **The TestConsole** is simplest solution for solving the domain problem was done through a console application. The console will simply load the Transport for London client using an autofac dependency injection library and show severe fatalities between 2014 and 2017. All the trace outputs will be logged to the window showing when this is loading from the server or when being loaded from my custom in memory cache, and then will run through the details one page at a time. The console will pause at the end for you to scroll through teh data to view what happened.
	!["TestConsole"](Screenshots/TestConsole.png) 
	5. **The domain** data serialized the data into poco classes. I tried initially to get away with doing it into a dynamic object, to see if I could get away with not building a model, but in the end I felt it was beneficial to have this strongly typed model to make life easier. I chose to use Flurl as I usually take time to create an HtmlClient builder, and then tests that go with this and I found that in the end I created something that looks like the Flurl library, except I need to spend time maintaining it. Creating it from scratch may have been useful for this exercise but I say pick your battles carefully and try to do what makes business sense.  This is a very useful library and has a nice testing interface which I exercised within my own tests. Feel free to use the standard .net client as this does nothing more than create a builder around this interface and make testing easier when mocking http endpoints. I included custom caching objects, sorting comparers, configuration extensions and various things to make a simple project more intersting. In your indaba, create what challenges or goals you want to face and drive it to the end.
	6. **The database project** utilises entity framework code first. To setup the database run *Git.Domain.EntityFramework.ConsoleApp* project and when it is loading, it will automatically create and seed all the data neded to run this project. The database takes two minutes per year to generate, taking roughly 30 minutes on a decent setup, but feel free to cancel when you have generated some data to run things with. There may be tests that will start failing, just repair or ignore them until you have time or interest to generate the seeded data. The other small issue is the seed is generated from the live server data and so the data does change from time to time, especially when 2018 data comes into fruition. The same data can be generated from running the *Git.Domain.Owin.Api* too so if you want to bypass the console, feel free. This is was the first consumer of the project was before the *Owin.Api* version 2 Api was extended to cater for this. Below is a typical example of what the console states when seeding the data. If you run the Api, it will probably output this information in the Visual Studio output debug window.
	!["Git.Domain.EntityFramework.ConsoleApp"](Screenshots/BulkInsertData.png) 
	7. **The git.domain.owin.api** is a self Hosting Owin Api run in a simple console application. It simply stays up by virtue of a console.readline and would usually be done more robustly as a service, or using [Topshelf](http://topshelf-project.com), where you can configure the application in different modes using console arguments. The api is self documenting with the swagger option visible in the console (TODO: Add a screen shot) 
2. My angular project was written using vs code and with latest angular cli to produce an Angular 7 project, but feel free to use an editor of your choice that works well with node.
3. My react project was developed using vscode and the typescript 


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

	https://airbnb.io/enzyme/docs/installation/index.html for setting up enzyme

TODO: Come up with idea for migrating data utilising Entity framework
	
	Take a look at the latest best ideas on a repository e.g. http://blog.gauffin.org/2013/01/repository-pattern-done-right/
	
	Make sure that a Readonly repository is setup to represent the final changes

	https://dzone.com/articles/repository-pattern-done-right
