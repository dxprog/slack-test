#Intro

In here, you'll find all the code for my Slack technical exercise.

#Checklist

Verifying that my project meets the specs that were sent to me:

- **The ability to access a public API and successfully retrieve data from it** - Yes, three different switchable sources with the ability to easliy add more.
- **The ability to display that data on a page** - Yup
- **The ability to update the UI of a page without refreshing** - Also yes. More on this in "Approach"
- **The ability to do all of the above using only native JavaScript (no libraries such as jQuery).** - Yes. Let's get to that "Approach" part
- **It should run without errors in the latest versions of Chrome, Safari, Firefox, and IE.** - Verified in:
 - Internet Explorer 10+
 - Chrome 49
 - Firefox 43
 - Edge
 - iPhone 5S running iOS9
 - Safari 9

#Approach

Having [made a semi-popular website that hits the general idea of this exercise](https://github.com/dxprog/reddit-booru), I added additional challenge by ramping up the last two items on the checklist. Arguably, it's over-engineered, but that was kind of the intention.

##Client-side Rendering

With regards rendering, the biggest thing I tried to avoid doing was any kind of string concatenation while building the UI elements. This meant a lot of `document.createElement`, but it provided a few interesting upsides:

1. Speed is the biggest one. Just explicitly creating your DOM elements is faster than parsing HTML via a string.
2. Caching DOM nodes. This is especially nice for the grid as I can actually reuse cells that already exist and simply swap out data.
3. Because of all that DOM node caching, I don't ever have to query the DOM for elements, making repeat renders even faster!

##"Native" JavaScript Only

I basically interpreted this as: write all code from scratch for this project without resorting to any third-party libraries. So, no jquery/lodash/webpack/babel/etc. But, I did want some of that sweet syntactic sugar. So, I built my own small library of methods that covers:

- **Promises** - It's a simple implementation (not chainable), but gets the job done.
- **Ajax** - Wrapper around `XMLHttpRequest` that handles various different data types. It of course uses the Promise library.
- **require** - I didn't want a giant javascript file nor did I want to futz around in the global scope much. So, I made a simple `require` thing to include dependencies, with a little bit of caching (could be improved with localStorage). My implementation also gives the included files a CJS type interface with `module.exports`.
- **Events mixin** - A late comer, but as the application was taking shape, I needed that functionality. The code behidn this could be reworked into a more generic mixin implementation.

#What Could Be Better

I'm pretty pleased with the code I've written, but there are a few issues hanging around:

- The JSONP and `require` implementation is probably riddled with security holes. I use `eval` twice...
- The grid uses resized versions of the whole image, which can bog down browsers, especially mobile ones. Ideally, it'd use a server-side generated thumbnail.
- Lazy loading images would help towards that end
