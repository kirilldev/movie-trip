## Movie Trip WebApp

https://movie-trip.herokuapp.com/

#### Description of application core idea

Let's say you are a cinemaddict and you have some spare time
in the San-Francisco city which you decided to spend visiting some
places from your favourite movies and to take some photos of it.

MovieTrip App will help you efficiently find those places and plan
you route using GoogleMaps *which you can then share
with a friend or send it to your email address.**

**Note: that feature is coming soon :)*

#### Reasoning behind a choice of technologies

After I got that challenge,
I tried to estimate an amount of time which I could dedicate to that project.
I found out that I couldn't spend more than 14 hours during those 7 days.
So as it is not a lot of time to learn something completely new
I decided to use a stack with which I had a bigger amount of experience
so I had higher probability to complete a project in time.

**Google Maps API** - I have never tried to use Map APIs before.
I chose google maps because it has good documentation and
it is the most popular maps in the world I think
(which means that they should be more familiar to the end user)

**AngularJS** - I needed some framework to write my own components.
I was thinking between AngularJS and React. If I had slightly more
time I would use React. Because AngularJS is older and as a result
we don't receive new third party components or bug fixes to existing.
Also React has a performance margin compare to the AngularJS.

**Webpack 3** - The most popular tool. Again,
I chose boring tech to avoid surprises during implementation.

**Node.js + Express.js** - Node.js allows us
to reuse some code on a client and a server and it is extremely easy
to find a hosting for it. Also it fits out needs (no heavy computation here).
It minimizes amount of languages in a project.
If we need some heavy computations or smth else we will
write micro service using a language which is suitable for that.

#### Trade-offs
Look for **TODO**s in the source code, it contains some ideas what may be improved.

I would like to use facebook flow to annotate object interfaces. But strip
plugin didn't work and I decided to not spend a lot of time for it.

I don't like that in a project not all files go through webpack requires
Mostly it was caused by the lack of time and thrird party code.

I see some warnings in console from babel which also could be fixed.

In a real project I will pay a lot of attention to resource cache policy

Also I would use local fonts instead of Google Fonts.

Of course I would use nsp to check for vulnerabilities in libs.

I will use svg icons instead of images for icons..

I think that I can separate more thing from root component to a separate controllers

I would write more useful tests. Especially system tests https://pbs.twimg.com/media/Cp9ecmOWcAAYu7F.jpg..

I decided that at current moment as we don't need to store
any info on our service we can live without a **DB**.

Also I didn't think seriously about the case when we will
have much more movies and locations on a map.
But is should be relatively easy to add it to the existing project.

I could start with yeoman generated project but usually,
it contains much more things then needed for small scale project.

#### How to run locally
1. Run ``npm i``
2. In a server module run ``npm run dev``
3. Open ``localhost:8090`` in your browser

P.S. ``run npm dev`` in frontend module to watch files