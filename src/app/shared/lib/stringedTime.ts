/**
   * standardizes time to show
   * receives input in seconds
   * returns in 'Xd Xh Xm' format
   */
export function stringizedTime(t) {
  let days, hours, minutes, seconds;
  days = Math.floor(t / 86400);
  t -= days * 86400;
  hours = Math.floor(t / 3600) % 24;
  t -= hours * 3600;
  minutes = Math.floor(t / 60) % 60;
  t -= minutes * 60;
  seconds = t % 60;

  return [
    days,
    'd ',
    hours,
    'h ',
    minutes,
    'm',
  ].join('');
}
