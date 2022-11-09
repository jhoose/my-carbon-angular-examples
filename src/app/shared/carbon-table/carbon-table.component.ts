import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  EventEmitter,
} from '@angular/core';

import {
  Table,
  TableModel,
  TableItem,
  TableHeaderItem,
  InlineLoadingState,
  IconService
  // Must import IconService for Carbon 4
} from 'carbon-components-angular';

import {
  ChevronRight20,
  Download16,
  Download20,
  DocumentDownload16,
  DocumentDownload20,
  DocumentView20,
  DocumentPdf20,
  View20
} from "@carbon/icons";
// Must also import each individual Carbon Icon (by size) for Carbon 4

@Component({
  selector: 'app-carbon-table',
  templateUrl: './carbon-table.component.html',
  styleUrls: ['./carbon-table.component.scss']
})
export class CarbonTableComponent implements OnInit {
  /*
    Required:
      [isLoading] Boolean
      [showPagination] Boolean // ToDo: Expore if showPagination can be a optional parameter
      [numberOfColumns] Number (whole numbers only) - for column span when table is loading or has no data
      [carbonTableModel] TableModel - a carbon table model with complete TableModel.header\TableHeaderItems
      (refreshTableData) Function() - function call to refresh data in table

    Optional:
      [tableHeader] Object default: { tableTitle: '', tableDescription: '' }
      [dateRange] Object default: { labels: { from: '', to: '' }, model: [] } - only required if (onDateRangeChange) is used
      (onDateRangeChange) Function() - function call to handle when user selects different date range so parents function can change query date range
      [showExportButton] Boolean default: false - only required if (exportData) is used
      (exportData) Function(carbonTableModel) - function call to handle exporting the TableModel that is currently being viewed to a downloadable file
      [addButton] Object default: { text: '', toolTip: '' } - only required if (addButtonAction) is used
      (addButtonAction) Function() - function call to handle when user clicks "Add" button
  */

  // Table Loading Spinner
  @Output() refreshTableData = new EventEmitter<any>();
  @Input() isLoading: boolean;
  state = InlineLoadingState.Active;
  loadingText: string = 'Loading Data...';
  successText: string = 'Data loaded';
  errorText: string = 'Data not found';
  isThereNoData = false;

  // Date Range
  hasDateRange: Boolean = false;
  @Output() onDateRangeChange = new EventEmitter<any>();
  @Input() dateRange = {
    labels: {
      from: '',
      to: ''
    },
    model: []
  };

  // Table Title & Description
  hasTableHeader: Boolean = false;
  @Input() tableHeader = {
    tableTitle: '',
    tableDescription: ''
  };

  // Table Models & More
  @Input() defaultColSortByIndex: number | undefined;
  @Input() defaultSortDescending: Boolean = false;
  @Input() numberOfColumns: number;
  @Input() showPagination: boolean;
  @Input() carbonTableModel: TableModel; // passed-in by parent component, also the current table view
  public initialTableModel = new TableModel(); // used to reset the table after clearing the search bar
  public sortSearchTableModel = new TableModel(); // for table search and/or sorting  
  skeletonModel = Table.skeletonModel(6, 9);
  skeleton: Boolean = true;
  searchValue: string = '';

  // Export Table Data To File
  @Output() exportData = new EventEmitter<TableModel>();
  @Input() showExportButton: Boolean = false;

  // Add Button
  showAddButton: Boolean = false;
  @Output() addButtonAction = new EventEmitter<TableModel>();
  @Input() addButton = {
    text: '',
    toolTip: ''
  };

  // ToDo: See if it's possible to move these templates to this shared carbon table component
  // Carbon Table's special table cells
  // @ViewChild('sortTableDateTemplate', { static: true }) sortTableDateTemplate: TemplateRef<any>;
  // @ViewChild('shipmentIDLinkTemplate', { static: true }) shipmentIDLinkTemplate: TemplateRef<any>;
  // @ViewChild('downloadTemplate', { static: true }) downloadTemplate: TemplateRef<any>;
  // @ViewChild('previewTemplate', { static: true }) previewTemplate: TemplateRef<any>;

  constructor(
    protected iconService: IconService // Must add IconService to Constructor for Carbon 4
  ) { }

  ngOnInit() {
    this.iconService.register(ChevronRight20);
    this.iconService.register(Download20);
    this.iconService.register(Download16);
    this.iconService.register(DocumentDownload16);
    this.iconService.register(DocumentDownload20);
    this.iconService.register(DocumentView20);
    this.iconService.register(DocumentPdf20);
    this.iconService.register(View20);

    if (this.tableHeader.tableTitle != '') {
      this.hasTableHeader = true;
    }

    if (this.dateRange.model.length === 2 &&
      this.dateRange.labels.from !== '' &&
      this.dateRange.labels.to !== ''
    ) {
      this.hasDateRange = true;
      // console.log('has a dateRange!');
      // console.log('passed-in dateRange:');
      // console.log(this.dateRange);
    }

    if (this.addButton.text != '') {
      this.showAddButton = true;

      if (this.addButton.toolTip == '') {
        this.addButton.toolTip = this.addButton.text;
      }
    }

    this.isLoading = true; // jenna hoose look here

    if (this.numberOfColumns) {
      this.skeletonModel = Table.skeletonModel(6, this.numberOfColumns);
    } else {
      this.skeletonModel = Table.skeletonModel(6, 9);
    }

    // if (this.carbonTableModel) {
      this.buildTable();
    // }
  }

  updateDateRange(event) {
    // console.log('updateDateRange() event:');
    // console.log(event);

    // console.log('New this.dateRange:');
    // console.log(this.dateRange);

    /*
      Calls parent component to handle dateRange changes (however the parent component handles dates)
      which will trigger the parent component to get new data for the new dateRange
      and rebuild carbonTableModel and send new table back to this shared component via ngOnChanges()
    */
    this.onDateRangeChange.emit(event);
  }

  refreshTable() {
    // console.log("carbon-table.component.ts refreshTable()");
    this.skeleton = true;
    this.carbonTableModel.data = []; // clear out old table data
    this.searchValue = ''; // clear search bar on refresh

    // Calls parent component to refresh data then rebuilds carbon-table.component.ts carbon table via ngOnChanges()
    this.refreshTableData.emit();
  }

  onClickAddButton() {
    this.addButtonAction.emit(this.carbonTableModel);
  }

  export() {
    this.exportData.emit(this.carbonTableModel);
  }

  ngOnChanges() {
    // LifeCycle Hook, this function will trigger when the Parent component updates @Input value
    // console.log('in carbonTableComponent ngOnChanges() carbonTableModel:');
    // console.log(this.carbonTableModel);
    this.searchValue = ''; // clear search bar when getting a new set of data
    this.buildTable();
  }

  buildTable() {
    // this.carbonTableModel.data = [];  // clear out old table data

    // console.log("carbon Table Model");
    // console.log(this.carbonTableModel); // is the current VIEW of the table
		this.initialTableModel.data = this.carbonTableModel.data; // used to reset the table after clearing the search bar
		this.sortSearchTableModel.data = this.carbonTableModel.data; // for table search and/or sorting

    if (this.isLoading === false) {
      this.isThereNoData = true;
    }

    // console.log("isLoading: ", this.isLoading);
    // console.log("isThereNoData: ", this.isThereNoData);

    this.skeleton = false;

    if (this.carbonTableModel.data.length > 0) {

      // If passed-in, sort table by default sort column
      // if (this.defaultColSortByIndex) {
      //   this.tableSort(this.defaultColSortByIndex);
      //   this.tableSort(this.defaultColSortByIndex);

      //   // console.log('Sort by column (index):');
      //   // console.log(this.defaultColSortByIndex);

      //   console.log('descending?');
      //   console.log(this.defaultSortDescending);

        // if (this.defaultSortDescending === false) { // Repeated to sort by descending
        //   console.log('call tableSort() twice');
        //   console.log(this.defaultSortDescending);
        //   this.tableSort(this.defaultColSortByIndex);
        // }

      // }

      this.selectPage(1);
    }
  }

  async tableSort(index: number) {
    /* Important Note:
    For single arrow sort direction icons to show
    the sorted table model headers must be the same as table view model headers */
    this.sortSearchTableModel.header = this.carbonTableModel.header;
    this.columnSort(this.sortSearchTableModel, index);
    this.selectPage(this.carbonTableModel.currentPage);
  }

  columnSort(passedInModel, index: number) {
    if (passedInModel.header[index].sorted) {
      // if already sorted flip sorting direction
      passedInModel.header[index].ascending = passedInModel.header[index].descending;
    }
    passedInModel.sort(index);
	}

  selectPage(page) {
    const offset = this.carbonTableModel.pageLength * (page - 1);
    this.carbonTableModel.currentPage = page;
    this.carbonTableModel.data = this.sortSearchTableModel.data.slice(
      offset,
      offset + this.carbonTableModel.pageLength
    );
  }

  searchValueChange(event) {
    this.searchValue = event;
		// console.log('Search Value:')
		// console.log(this.searchValue);

    if (this.searchValue === '') {
			this.clearSearchBar();
		} else if (this.searchValue && this.searchValue !== '') {
			let searchString = this.searchValue.toLowerCase();

      const dataFiltered = this.initialTableModel.data.filter((tableRow) => {
        let containsValue = false;

        tableRow.forEach((item) => {

          // Convert all data types to string for search string comparison
          if (item.data !== undefined) {
            let tmpVal;

            if (typeof item.data === 'number') {
              tmpVal = String(item.data).toLowerCase();
            }

            if (typeof item.data === 'string') {
              tmpVal = item.data.toLowerCase();
            }

            // In JavaScript arrays are a type of object
            if (typeof item.data === 'object') {
              tmpVal = Object.values(item.data).toString().toLowerCase();
            }

            // Does data string include search value?
            if (tmpVal && tmpVal.includes(searchString)) {
              containsValue = true;
            }
          }

        });

        return containsValue;

      });

      this.sortSearchTableModel.data = dataFiltered;
      this.sortSearchTableModel.totalDataLength = dataFiltered.length;
      this.sortSearchTableModel.currentPage = 1;

      this.carbonTableModel.data = this.sortSearchTableModel.data;
      this.carbonTableModel.totalDataLength = this.sortSearchTableModel.totalDataLength;
      this.carbonTableModel.currentPage = this.sortSearchTableModel.currentPage;
      this.selectPage(1);
    }
  }

  clearSearchBar() {
    this.sortSearchTableModel.data = this.initialTableModel.data;
    this.carbonTableModel.totalDataLength = this.sortSearchTableModel.data.length;
    this.searchValue = '';
    this.refreshTable(); // do we need this?
    this.selectPage(1);
  }

}
