// `wait` is a group of functions that terminate after given number of ms

wait(1000*MS); // resolves in 1000 milliseconds, never rejects
wait(5*S); // resolves in 5 seconds, never rejects
wait(1*M); // resolves in 1 minute, never rejects

// `for` must resolve within the given ms, else reject

wait(1000*MS).for(id("id"));
wait(1000*MS).for(clazz("class"));
wait(1000*MS).for(attribute("checked"));
wait(1000*MS).for(attribute("checked").of("value"));
wait(1000*MS).for(selector(".class"));

wait(1000*MS).for(async_fn);
wait(1000*MS).for(promise);

id("id"); // promise that returns id check
clazz("class"); // promise that returns membership to class
attribute("attribute"); // promise that returns monitoring of attribute
