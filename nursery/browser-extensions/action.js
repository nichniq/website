const goal = "scroll to bottom of page";
const rate = 10*MS;
const duration = 1*S;
const predicate = () => document.querySelector(".loading") == null;
const action = () => window.scrollTo(0, document.body.scrollHeight);

attempt(goal).every(rate).for(duration).when(predicate).do(action).

action({
  attempt: "scroll to bottom of page",
  every: 10*MS,
  for: 1*S,
  when: () => document.querySelector(".loading") == null,
  do: window.scrollTo(0, document.body.scrollHeight)
});
