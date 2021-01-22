# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).
(Beware!!! This was created as educational purpose. Real use of this app can lead unexpected circumstances!)

## Final Product

!["This is the main scree when user is Logged in. It displays user's own shortened URLs."](https://github.com/chanoonna/tinyapp/blob/master/docs/tinyapp2.png)
!["This is URL edit page with more details about the URL."](https://github.com/chanoonna/tinyapp/blob/master/docs/tinyapp1.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Features

- Registered user can create their own shortened URLs and anybody can use that portal.
- Anyone who uses the link will add up the count.
- It also shows when it was created.
- URL can be changed later.


## Known bugs

## Features in mind

- Browsing another user's URLs with less detail.
- Listing top 10 most used URLs.
- Total count of the entire URLs.
- Changing User infomation (email, password).