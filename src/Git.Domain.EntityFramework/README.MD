# Database indaba

TODO: Create test solution when this exercise starts

The point of this exercise will be to create a simple database, in my case I have chosen an EF codefirst database that will represent the TFL Accident Statistics domain types.

The migration of the database will be from the TFL live data and when there is data or a database, there will be no need to run the migration.

The exercise will should validate setting up an ORM (any) database and its migrations, a mechanism for creating repositories too query the  any data without needing caching mechanisms to optimise how we get and query the data.

Finally feel free to create a controller that will access this data and structure to compare how much more efficient this will be than the existing structure, and feature toggle this into the final solution so it is possible to compare. Feel free to create some timed mechanism that will get both sets of data and output the timing.

