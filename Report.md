## PearCode ##

# Meta #
- who was on your team?
Just me

- URL of deployed app 
https://pearcode.swoogity.com

- URL of github repo 
https://github.com/addisonchen/pearcode

- deployed and working?
yes

- for each member...  
I did the front end and back end and deployemnt

# What does it do? #
PearCode provides a platform for collaborative coding. Users can
create and share files. Everyone who the file is shared with can edit,
view, and run the file at the same time. 

There are several languages to choose from, with support for syntax
highlighting, autocompletion, and running code in the browsers.
Additional features include file downloads and live activity
information (users can see when other users are typing or executing
code live)

# How has it changed? #
Not much has changed. Most changes were small features such as being
able to filter/search your personal files as well as download source
code to your local computer. In addition to displaying live user
typing, the web application also displays live user code execution.

# How do users interact? What can they do? #
Users who start at the home page have a code window where they can
write some code and execute it to test the coding part of the
application. This makes it quick and easy to visit the website and
just run a few lines if that is what you need to do.

If users need more functionality they can sign up or login to save and
share thier files. Once logged in, users are taken to their personal
page, where they can create new files, view their files, view files
shared with them, as well as logout or edit their account information. 
If users have a lot of files or have been invited to work on many
files, they can use the search/filter feature to search by keywords or
filter by language.

When a user creates a file, they are taken to the page for that file.
There, they can invite other users by email, modify the file name,
change the file description, post comments, execute code, and most
importantly, modify the file source code. There are also options to
save changes, download a copy of the file locally, copy the link to
the page to share with other users, and delete the file.

Invites are created by entering an email, an account linked to that
email will have the ability to modify the source code, download the
code, add comments, and execute the code. They will not be able to
create new invites, modify the file name or description, save changes,
or delete the file.

Users not invited can view the file, but cannot perform any
operations. This is the same for users who are not logged in, but they
will have an option to log in or sign up if they wish.

# Meeting requirements #
Has a phoenix server as a backend, it works as a JSON API and uses
JWTs. The frontend is a react app that uses the API as well as web
sockets.

The entire project is hosted on my VPS. It includes user accounts that
require passwords. The postgres database has tables for users, files,
invites, and comments. The API that I used is Judge0, and has been
configured to require an authentication token.

Channels are used to push file changes to other users as well as
Presence information. Presence is the neat feature that allows users
to see what other users are doing live. The app has been tested by
creating files and working on them concurrently with other people.

# Beyond requirements # A lot of work was put into making the user
interface interesting.  Although it is not the best looking interface,
the goal was to keep users focused on their code by reducing
distractions. There are many CSS microinteractions such as loading
animations and hover selectors. In addition to this, there are many
small features such as downloading files in their language file type
or being able to filter and search through files that are not
necessarily complex, but add to the user experience as a whole.

# Complex Component # The complex component of my application is the
sockets and channels communication. I set up channels to handle a
single file, identified by the file owner id as well as the file id. A
GenServer is used to maintain state, and a Presence module is used to
keep track of who is currently in the channel as well as their
activity with the file. The channel modifies both the GenServer and
the Presence module accordingly.

# Challanging Component # The Judge0 API executes code and puts the
results to a callback URL The most challanging component of building
the application was configuring and hosting the Judge0 API. Hosting
the API on my VPS allows for unlimited computations rather than being
limited by the servers hosted by Judge0. 

Hosting Judge0 required setting up a docker-compose container. I have
not had experience with docker, and a lot of time was spent figuring
out what changes I needed to make to my nginx instance as well as my
postgres and redis databases.  Another issue caused by the
docker-compose container was providing a url for the callback put. A
lot of testing was completed in order to understand exactly what url
would work and how the Phoenix server should handle the callback
request as each user and channel can run requests at any time.  


