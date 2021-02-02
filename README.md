## Project Requirements

### ShareB&B
As we move towards a world where people share more and more things, it’s time we build an application where users can share outdoor spaces like backyards or pools!

 - Users should be able to search for homes and apartments to with an outdoor space to rent
 - Authenticated users should be able to post a listing with photos, a price, and details of the private outdoor space
 - Authenticated users I should be able to message other users to ask questions about listings and book them
 - Photos should be stored in Amazon S3, not in a database
 - Users should be able to search for a listing
 - As a bonus, include an interface with a map that updates with listings when moved


Front-End: 
 - SPA (Single Page Application) with React

Back-End:
 - Express 

Other Technologies:
 - AWS S3


Non Autheticated Users:
- View listings
- Search listings

Autheticated Users:
- Post listing
- Message hosts 


Listings: 
- Photos
- Price
- Details


List of things to tackle:
- Database setup
- homepage  
- unathenticated routes (viewing all the listings)
- authentication
- functionality around posting a new listing
    - Both frontend and backend
    - Working with S3 to store photos

Bonus: to work on in case there's extra time 
- Implementing a map feature with updating listings when moved 
- Favorites: like/star button to favorite a listing
- Check-in/Check-out
- Have amenities be many-to-many or using an array?
