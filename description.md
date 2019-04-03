## System Architecture
1. Backend
    1. Bookface is designed using NodeJS and Express for the backend
    1. The backend calls are prefixed with <i>/api</i>
    1. The backend calls are protected using JWT tokens which are generated in the backend and sent to UI to support authentication.
1. Database
    1. For data storage MongoDB is used. The Mongo Cloud is where the data is hosted.
    1. Data is represented by Json objects
1. Front End
    1. Jade/Pug is used for the front end technology.
    1. Server side rendering is used to generate the front end pages from the Jade templates.
1. Email
    1. Send Grid is used to send the emails. Currently the free account allow 100 emails to be sent per day.
1. Project Structure
    1. The project is broken down into two main packages 
1. Diagrams 
    1. Plant UML was used for the diagrams. 
    1. Diagrams Can be view under the <i>/diagrams</i> directory