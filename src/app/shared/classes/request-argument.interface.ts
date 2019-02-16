export interface RequestArgument {
  /* default: true
    reason: indicates whether the spinner should be enabled
  during request sending untill the response comes or not.
    usage: some use cases that we don't want are, things
  we need to update all the time, like temperature,
  cpu usage, on the print page, etc. */
  spin?: boolean;

  /* default: false
    reason: prevent console erroring for each request
  all the times that just pollutes the code readability
    usage: sometimes we don't want just the console
  log for our error handling (though it's the most case)
  and we need more. */
  throwError?: boolean;
};
