# The programming coursework using Node.js

## Overview

This coursework covers the development of an enterprise level application using a Javascript based 
framework. The coursework is designed to give students hands-on experience with building 
enterprise applications. Furthermore, all the technologies used are production grade, 
giving students the experience and knowledge they need to build a real enterprise application. 

## Scenario

You have been asked to develop **Bookface**, a social networking site for people who love reading and 
always have their face in a book. The site will allow avid readers to comment on their favourite books, 
rate books, and to read the comments made by others on their favourite books and other books 
by their favourite authors. Users must register before they can submit comments 
on a book and be authorised via email; users should choose a screen name and they 
should supply an email address. 

* The site should list authors together with their books (requiring *C*reate-*R*ead-*U*pdate-*D*elete
facilities).
* Comments are made on books, not on authors. 
* Users can add authors if they are not already there, and they can add books to authors. 
* Your program should list a user's favourite books and allow them to view other members of the site 
  who listed those books as being among their favourite books.

You can use any JavaScript based stack to complete this task but it must use `Node.js` as its basis.

## Deliverables

* Your code should be regularly *pushed* to your GitHub Classroom account.
* The configuration, tooling etc., required to run your application should be detailed in a file 
  `requirements.txt`.
* You should include a file, `description.md`, which describes the design of your system, the
  architecture, and the justification for your design and implementation choices.
* The only security issues that need to be addressed are for the user registration.
* You should provide an *administrator* account, which enables the maintenance of the system (i.e.,
  CRUD of users, books, comments, etc.).
  
## Submission

Your GitHub Classroom repository will be cloned on the due date (`Sunday, 7th April by 23:55`) at 23:59.

## Running Application
1. npm install tap-spec -g
1. npm install tape -g
2. npm install
3. npm run start
4. Browse to localhost:3000

## Testing Application
1. npm run test

## Live Application on Heroku
1. https://bookfaceapp.herokuapp.com/

## Travis for Test Automation
1. https://travis-ci.com/oanguin/bookface/jobs/160634230

## Deploy Application
1. npm run deploy

## Testing Endpoints With Postman
1. You need to generate a `x-access-token` and place it in the header to make requests to the backend. The value can be retrieved by logging in with a user and checking the cookie values. You can place the value in a header filed titled `x-access-token`.

## Login to application
1. Test User
  1. user name: testuser@email.com
  1. password: 123456
1. Test Admin
  1. adminuser
  1. 123456
1. Next Test User
  1. oanguin
  1. 123456