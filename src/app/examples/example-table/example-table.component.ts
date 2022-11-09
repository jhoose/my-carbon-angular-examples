import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  ViewChild,
  TemplateRef
} from '@angular/core';

import {
  Table,
  TableModel,
  TableItem,
  TableHeaderItem
} from 'carbon-components-angular';

import * as moment from 'moment';

@Component({
  selector: 'app-example-table',
  templateUrl: './example-table.component.html',
  styleUrls: ['./example-table.component.scss']
})
export class ExampleTableComponent implements OnInit {

  // Date Range Filter
  twoWeeksInThePast = moment.utc().startOf('day').subtract(14, 'days');
  // ninetyDaysInThePast = moment.utc().startOf('day').subtract(90, 'days');
  todayAtMidnight = moment.utc().endOf('day');

  dateRangeModel = [
    this.twoWeeksInThePast.valueOf(), // in milliseconds
    this.todayAtMidnight.valueOf() // in milliseconds
  ];

  selectedDateRange: Array<String> = [
    this.twoWeeksInThePast.toISOString(),
    this.todayAtMidnight.toISOString()
  ];

  noDateRange = false;
  invalidText = 'Invalid date format';
  invalid = false;

  tableDateRange = {
    labels: {
      from: 'Date From',
      to: 'Date To'
    },
    model: this.dateRangeModel
  };
  // End Date Range Filter

  //// Modal Edit ////
  isButtonDisabled: boolean = true;
  modalDebugging: boolean = true; // false; ToDo: Set to false when done testing
  showEditRowModal: boolean = false;
  saveModal = 'Update Row';
  cancelModal = 'Cancel';
  modalTitle = '';
  errorModal = '';

  pastRowValues: any;
  currentRow: any;

  showEditTableColumn: boolean = true;
  showEditColorsDropdownTableColumn: boolean = true;

  priorityOptions = [
    { content: 'high' },
    { content: 'medium' },
    { content: 'low' }
  ];

  colorOptions: any = [
    { content: 'pink' },
    { content: 'red' },
    { content: 'yellow' },
    { content: 'blue' },
    { content: 'orange' },
    { content: 'purple' },
    { content: 'green' },
    { content: 'forest' },
    { content: 'sky' },
    { content: 'sunset' },
    { content: 'teal' },
    { content: 'school bus' },
    { content: 'banana' },
    { content: 'navy' },
    { content: 'wine' },
    { content: 'olive' },
    { content: 'white' },
    { content: 'black' },
    { content: 'gray' },
    { content: 'lime' },
    { content: 'maroon' },
    { content: 'aqua' },
  ];

  dummyData = [];

  tableModel: TableModel;
  isTableLoading: boolean = true;
  defaultTableColumnSortByIndex: number;
  numberOfColumnsInExampleTable: number;
  exampleTableHeader = {
    tableTitle: 'Table Name',
    tableDescription: 'Short 1 sentence or less table description'
  };
  exampleTableColumns = [
    new TableHeaderItem({ data: 'Edit', visible: false, style: { 'padding-left': '1rem' } }),
    new TableHeaderItem({ data: 'Unique ID' }),
    new TableHeaderItem({ data: 'Priority' }),
    new TableHeaderItem({ data: 'Country', title: 'Country Name' }),
    new TableHeaderItem({ data: 'Colors', title: 'List of Colors' }),
    new TableHeaderItem({ data: 'Date', compare: this.compareDates, style: { 'padding': '0px', 'min-width': '115px' } }),
    new TableHeaderItem({ data: 'File Type', title: 'Document Type' }),
    new TableHeaderItem({ data: 'File Name' }),
    new TableHeaderItem({ data: 'Download', style: { 'padding': '0px', 'min-width': '75px' } })
  ];
  @ViewChild('editRowButton', { static: true }) editRowButton: TemplateRef<any>;
  @ViewChild('idLinkTemplate', { static: true }) idLinkTemplate: TemplateRef<any>;
  @ViewChild('sortTableDateTemplate', { static: true }) sortTableDateTemplate: TemplateRef<any>;
  @ViewChild('downloadFileTemplate', { static: true }) downloadFileTemplate: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
    // Build an empty tableModel first for child carbon-table.component.ts then get data and fill the table
    this.buildExampleTable();

    // jenna whatever delay then this.getDummyData();
    this.getDummyData();
  }

  getDummyData() {
    this.isTableLoading = true;
    this.dummyData = []; // clear out old data

    // Just for example put getDummyData logic in setTimeout to act like api call
    setTimeout(() => {
      console.log('sleep');

      // Data is hardcoded here is just dummy data for an example, typically you would do a call to API to get data
      this.dummyData = [
        {
          id: '1',
          country: 'Japan',
          priority: 'high',
          colors: ['red', 'pink', 'wine'],
          date: '2022-01-25T20:04:01.692Z',
          file: { fileName: 'randomFileName1', fileType: 'docx'},
        },
        {
          id: '666',
          country: 'Jamaica',
          priority: 'medium',
          colors: ['green'],
          date: '2022-02-15T20:04:01.692Z',
          file: { fileName: 'randomFileName2', fileType: 'pdf'},
        },
        {
          id: '555',
          country: 'USA',
          priority: 'low',
          colors: ['yellow', 'school bus', 'banana'],
          date: '2021-05-30T20:04:01.692Z',
          file: { fileName: 'randomFileName3', fileType: 'xlsx'},
        },
        {
          id: 'abc123',
          country: 'Finland',
          priority: '',
          colors: ['blue', 'navy'],
          date: '2021-03-03T20:04:01.692Z',
          file: { fileName: 'randomFileName4', fileType: 'pdf'},
        },
        {
          id: 'Aa',
          country: 'Australia',
          priority: '',
          colors: [],
          date: '2021-02-10T20:04:01.692Z',
          file: { fileName: 'randomFileName5', fileType: 'pdf'},
        },
        {
          id: '0',
          country: 'United Kingdom',
          priority: '',
          colors: [],
          date: '2021-02-10T20:04:01.692Z',
          file: { fileName: 'randomFileName6', fileType: 'pdf'},
        },
        {
          id: 'Bb',
          country: 'United Arab Emirates',
          priority: '',
          colors: [],
          date: '2021-02-10T20:04:01.692Z',
          file: { fileName: 'randomFileName7', fileType: 'pdf'},
        },
        {
          id: '001',
          country: 'Ukraine',
          priority: '',
          colors: [],
          date: '2021-02-10T20:04:01.692Z',
          file: { fileName: 'randomFileName8', fileType: 'pdf'},
        },
        {
          id: '01',
          country: 'France',
          priority: '',
          colors: [],
          date: '2021-02-10T20:04:01.692Z',
          file: { fileName: 'randomFileName9', fileType: 'pdf'},
        },
        {
          id: '10',
          country: 'Switzerland',
          priority: '',
          colors: [],
          date: '2021-02-10T20:04:01.692Z',
          file: { fileName: 'randomFileName10', fileType: 'pdf'},
        },
        {
          id: 'OG',
          country: 'Germany',
          priority: '',
          colors: [],
          date: '2021-02-10T20:04:01.692Z',
          file: { fileName: 'randomFileName11', fileType: 'pdf'},
        },
        {
          id: 'Aaa',
          country: 'Argentina',
          priority: '',
          colors: [],
          date: '2021-02-10T20:04:01.692Z',
          file: { fileName: 'randomFileName12', fileType: 'pdf'},
        }
      ];

      // let fromShipDate = moment(this.selectedDateRange[0].toString()).format('YYYY-MM-DD');
      // let toShipDate = moment(this.selectedDateRange[1].toString()).format('YYYY-MM-DD');
      // Add selected date range to api parameters
      // let apiParams = '?fromDate=' + fromShipDate + '&toDate=' + toShipDate;

      console.log("Refreshed Dummy Data!");

      this.buildExampleTable();

    }, 3000);

  }

  buildExampleTable() {
		this.tableModel = new TableModel();
		this.tableModel.data = []; // clear out old table data
		this.tableModel.header = this.exampleTableColumns;
		this.numberOfColumnsInExampleTable = this.tableModel.header.length; // for column span when table has no data

    console.log('dummyData:');
		console.log(this.dummyData);

    console.log('dummyData.length:');
		console.log(this.dummyData.length);

    if (this.dummyData.length > 0) {
      this.tableModel.totalDataLength = this.dummyData.length; // for pagination

      if (this.showEditTableColumn) {
        // Show Edit table column if user has the authority to update
        let editHeaderIndex = this.tableModel.header.findIndex(column => column.data === 'Edit');
        this.tableModel.header[editHeaderIndex].visible = true;
        // Does the same thing as...
        // new TableHeaderItem({ data: 'Edit', style: { 'padding-left': '1rem' }, visible: true }),
      }

      // jenna ToDo
      // let defaultTableColumnSortByIndex = this.tableModel.header.findIndex(column => column.data === 'Date'); // intial table column to default sort by
      this.defaultTableColumnSortByIndex = this.tableModel.header.findIndex(column => column.data === 'Country'); // intial table column to default sort by

      // this.tableModel.header[this.defaultTableColumnSortByIndex].sorted = true;

      // jenna ToDo: showEditColorsDropdownTableColumn: boolean = true;

      // jenna ToDo: handle date range changes

      // jenna ToDo: download button icon

      // jenna ToDo: Jenna add 11 things of data

      for (let d = 0; d < this.dummyData.length; d++) {

        let colorsList = '';
        if (this.dummyData[d].colors?.length > 0) {
          colorsList = this.dummyData[d].colors.join(', ');
        }

        const rowDateData = {
          'date': this.dummyData[d].date,
          'display': new Date(this.dummyData[d].date).toUTCString()
        };

        this.tableModel.addRow([
          new TableItem({ data: { currentRow: this.dummyData[d] }, template: this.editRowButton }),
          new TableItem({ data: this.dummyData[d].id, template: this.idLinkTemplate }),
          new TableItem({ data: this.dummyData[d].priority }),
          new TableItem({ data: this.dummyData[d].country }),
          new TableItem({ data: colorsList }),
          new TableItem({ data: rowDateData, template: this.sortTableDateTemplate }),
          new TableItem({ data: this.dummyData[d].file.fileType }),
          new TableItem({ data: this.dummyData[d].file.fileName }),
          new TableItem({ data: this.dummyData[d].file, template: this.downloadFileTemplate })
        ]);
      } // End for loop
    } // End if there is any data

    console.log('tableModel:');
		console.log(this.tableModel);

    this.isTableLoading = false;
  }

  downloadFile(documentData) {
    console.log('clicked documentData:');
    console.log(documentData);

    alert('download ' +  documentData.fileName + '.' + documentData.fileType + ' logic here!');
  }

  async dateRangeChange(dateEvent) {
		// WARNING! Carbon DatePicker dates are always the start of day 00:00:00 in local timezone
		console.log("dateRangeChange() dateEvent:");
		console.log(dateEvent);

		// Start date picked (at midnight)
		let dateRangeStart = moment(dateEvent[0]).utc().startOf('day');

		// End date picked (right before midnight)
		let dateRangeEnd = moment(dateEvent[1]).utc().endOf('day');

    if (dateEvent[0] && dateEvent[1]) {
      this.selectedDateRange = [
        dateRangeStart.toISOString(),
        dateRangeEnd.toISOString()
      ];
    }

		console.log('New dateRangeModel:');
		console.log(this.dateRangeModel);

		console.log('New selectedDateRange:');
		console.log(this.selectedDateRange);

    this.noDateRange = false;
    this.getDummyData();
  }

  flattenTableObject(passedInTableData: Array<Array<TableItem>>) {
		const flattenedTableData: Array<any> = [];

		passedInTableData.forEach(row => {
			const obj: any = {};
			this.tableModel.header.forEach((Key, i) => {
				if (typeof row[i].data === 'object' && row[i].data !== null && row[i].data.display) {
					// data.display (UTC or YYYY-MM-DD date format) and paired with data.date (ISO date format)
					obj[Key.title] = row[i].data.display;
				} else {
					obj[Key.data] = row[i].data;
				}
				i += 1;
			});
      // Don't put Edit and Download in excel export
			delete obj.Edit;
			delete obj.Download;

			flattenedTableData.push(obj);
		});
		return flattenedTableData;
	}

  exportTable(passedInTable: TableModel) {
    alert('Put export table data to excel sheet & download logic here!');

    if (passedInTable === undefined || passedInTable.data === undefined || passedInTable.data.length < 1) {
      return;
    }

    const dataForExcel = this.flattenTableObject(passedInTable.data);
    console.log('dataForExcel:');
    console.log(dataForExcel);

    // whatever export excel sheet logic here....
  }

  /*
    compareDates(): Sort Dates Correctly on Carbon Tables

    Requires:
    new TableHeaderItem({ data: 'table column name', compare: this.compareDates }),

    const rowDateData = {
      'date': this.rawShipmentData[s].someDateOrTimestamp,
      'display': new Date(this.rawShipmentData[s].someDateOrTimestamp).toUTCString()
    };

    new TableItem({ data: rowDateData, template: this.sortTableDateTemplate }),

    <ng-template #sortTableDateTemplate let-data="data">
      {{ data.display }}
    </ng-template>

    Displays (as a UTC string)
    ddd, DD MMM YYYY HH:mm:ss GMT		Thu, 20 Jan 2022 17:35:59 GMT

    Sorts by data.date (as a ISO date string)
    YYYY-MM-DDTHH:mm:ss.sssZ			2021-12-15T14:34:18.166Z)
  */
  compareDates(one: TableItem, two: TableItem) {
    if (!one || !two || !one.data || !two.data) {
      return 0;
    }

    if (one.data.date === '') {
      return -1;
    }

    if (two.data.date === '') {
      return 1;
    }

    // built-in JS date validation is terrible
    if (!moment(one.data.date).isValid() || !moment(two.data.date).isValid()) {
      return 0;
    }

    const dateOne = new Date(one.data.date).toISOString();
    const dateTwo = new Date(two.data.date).toISOString();

    if (dateOne > dateTwo) {
      return 1;
    } else if (dateOne < dateTwo) {
      return -1;
    } else {
      return 0;
    }
  }

  openModal(passedInRowData: any) {
    this.showEditRowModal = true;
    this.errorModal = '';
    this.pastRowValues = passedInRowData;
    this.isButtonDisabled = true; // re-disable update button every time modal opens
    this.modalTitle = 'Edit Table Row';
    this.currentRow = { ...passedInRowData };
  }

  onModalDropDownChange() {
    // Avoid unnecessary updates if a user accidentally tries to update a row with the same values
    if (this.currentRow.priority == this.pastRowValues.priority && this.pastRowValues.priority !== '') {
      this.isButtonDisabled = true;
    } else {
      this.isButtonDisabled = false;
    }
  }

  onModalSave() {
    this.errorModal = '';
    // whatever save logic here
    console.log("Edit Saved!");
    this.getDummyData();
    this.closeModal();
  }

  closeModal() { // No need to refresh table if no changes were saved
    this.showEditRowModal = false;
  }

}
