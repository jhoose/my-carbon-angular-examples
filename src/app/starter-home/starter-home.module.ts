import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExampleTableComponent } from '../examples/example-table/example-table.component';

import { StarterHomeComponent } from './starter-home/starter-home.component';
import {
	GridModule,
	ListModule,
	TabsModule,
	TilesModule
} from 'carbon-components-angular';
import { StarterHomeRoutingModule } from './starter-home-routing.module';

@NgModule({
	imports: [
		CommonModule,
		StarterHomeRoutingModule,
		GridModule,
		ListModule,
		TabsModule,
		TilesModule,
		ExampleTableComponent
	],
	declarations: [StarterHomeComponent]
})
export class StarterHomeModule { }
