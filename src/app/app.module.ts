import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
	UIShellModule,
	IconModule,
	ButtonModule,
	InlineLoadingModule,
	ContentSwitcherModule,
	GridModule,
	TableModule,
	NFormsModule,
	DialogModule,
	SearchModule,
	PaginationModule,
	ModalModule,
	InputModule,
	PlaceholderModule,
	NotificationModule,
	DatePickerModule,
	FileUploaderModule,
	DropdownModule,
	ProgressIndicatorModule,
	BreadcrumbModule,
	TabsModule,
	AccordionModule
  } from 'carbon-components-angular';

// carbon-components-angular default imports
// import { IconModule, IconService, UIShellModule } from 'carbon-components-angular';
// import Notification20 from '@carbon/icons/es/notification/20';
// import UserAvatar20 from '@carbon/icons/es/user--avatar/20';
// import AppSwitcher20 from '@carbon/icons/es/app-switcher/20';
// import Renew16 from '@carbon/icons/es/renew/16';
import { HeaderComponent } from './header/header.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { DocsComponent } from './pages/docs/docs.component';
import { SupportComponent } from './pages/support/support.component';
import { Link1Component } from './pages/link1/link1.component';

import { CarbonTableComponent } from './shared/carbon-table/carbon-table.component';
import { ExampleTableComponent } from './examples/example-table/example-table.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		CatalogComponent,
		DocsComponent,
		SupportComponent,
		Link1Component,
		CarbonTableComponent,
		ExampleTableComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		AppRoutingModule,
		UIShellModule,
		IconModule,
		ButtonModule,
		InlineLoadingModule,
		ContentSwitcherModule,
		GridModule,
		TableModule,
		NFormsModule,
		DialogModule,
		SearchModule,
		PaginationModule,
		ModalModule,
		InputModule,
		PlaceholderModule,
		NotificationModule,
		DatePickerModule,
		FileUploaderModule,
		DropdownModule,
		ProgressIndicatorModule,
		BreadcrumbModule,
		TabsModule,
		AccordionModule
	],
	exports: [
	  ExampleTableComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
