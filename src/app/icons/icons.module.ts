import { NgModule } from '@angular/core';
import {
  IconSend,
  IconPlus,
  IconCalendar,
  IconSlash,
  IconAlertTriangle,
  IconShield,
  IconRefreshCcw,
  IconCloud,
  IconLock,
  IconZapOff,
  IconFile,
  IconAlertCircle,
  IconUser,
  IconPlusCircle,
  IconPlusSquare,
  IconInfo} from 'angular-feather';

const icons = [
  IconSend,
  IconAlertCircle,
  IconUser,
  IconPlus,
  IconCalendar,
  IconPlus,
  IconSlash,
  IconAlertTriangle,
  IconShield,
  IconRefreshCcw,
  IconCloud,
  IconPlusCircle,
  IconPlusSquare,
  IconLock,
  IconZapOff,
  IconFile,
  IconInfo
];

@NgModule({
  imports: icons,
  exports: icons
})
export class IconsModule { }
