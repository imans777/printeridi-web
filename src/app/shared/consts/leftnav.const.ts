import {NavLink} from "../classes/navlink.interface";

export const leftNavNormalItems: NavLink[] = [
  {
    label: 'Home',
    route: '/home',
    icon: 'home',
  }, {
    label: 'Camera',
    route: '/camera',
    icon: 'camera_alt',
  }, {
    label: 'Extrude',
    route: '/extrude',
    icon: 'flip_in_front',
  }, {
    label: 'Bedleveling',
    route: '/bedleveling',
    icon: 'settings_input_composite',
  }, {
    label: 'Recent Prints',
    route: '/last-prints',
    icon: 'watch_later',
  }, {
    label: 'Timelapse',
    route: '/timelapse',
    icon: 'timelapse',
  }, {
    label: 'Settings',
    route: '/settings',
    icon: 'settings_applications',
  }
];

export const leftNavOnPrintItems: NavLink[] = [
  {
    label: 'Print',
    route: '/print-page',
    icon: 'print',
  }, {
    label: 'Camera',
    route: '/camera',
    icon: 'camera_alt',
  }, {
    label: 'Settings',
    route: '/settings',
    icon: 'settings_input_composite',
  }
]
