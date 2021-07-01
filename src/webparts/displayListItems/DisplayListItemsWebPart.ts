import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DisplayListItemsWebPartStrings';
import MockHttpClient from './MockHttpClient';

import DisplayListItems from './components/DisplayListItems';
import { IDisplayListItemsProps } from './components/IDisplayListItemsProps';
import styles from './components/DisplayListItems.module.scss';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';

export interface IDisplayListItemsWebPartProps {
  description: string;
  longdesc: string;
  showlongdesc: boolean;
  test2: string;
  colorToggle: boolean;
}

export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Title: string;
  Id: string;
}

export default class DisplayListItemsWebPart extends BaseClientSideWebPart<IDisplayListItemsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDisplayListItemsProps> = React.createElement(
      DisplayListItems,
      {
        description: this.properties.description,
        longdesc: this.properties.longdesc,
        showlongdesc: this.properties.showlongdesc,
        test2: this.properties.test2,
        colorToggle: this.properties.colorToggle,

      }
    );

    ReactDom.render(element, this.domElement);
    this._renderListAsync();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Description'
                }),
                PropertyPaneTextField('longdesc', {
                  label: 'Multi-line Text Field',
                  multiline: true
                }),
                PropertyPaneCheckbox('showlongdesc', {
                  text: 'Show Long Description?'
                }),
                PropertyPaneToggle('colorToggle', {
                  label: 'Toggle',
                  onText: 'Blue',
                  offText: 'Red'
                }),
                PropertyPaneDropdown('test2', {
                  label: 'Dropdown',
                  options: [
                    { key: '1', text: 'One' },
                    { key: '2', text: 'Two' },
                    { key: '3', text: 'Three' },
                    { key: '4', text: 'Four' }
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private _getMockListData(): Promise<ISPLists> {
    return MockHttpClient.get()
      .then((data: ISPList[]) => {
        var listData: ISPLists = { value: data };
        return listData;
      }) as Promise<ISPLists>;
  }

  private _getListData(): Promise<ISPLists> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl 
      + `/_api/web/lists?$filter=Hidden eq false`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private _renderList(items: ISPList[]): void {
    let html: string = '';
    items.forEach((item: ISPList) => {
      html += `
        <ul class="${styles.list}">
          <li class="${styles.listItem}">
            <span class="ms-font-l">${item.Title}</span>
          </li>
        </ul>`;
    });

    const listContainer: Element = this.domElement.querySelector('#spListContainer');
    listContainer.innerHTML = html;
  }

  // The Environment.type property helps you check if you are in a local 
  // or SharePoint environment.The correct method is called 
  // depending on where your workbench is hosted.
  private _renderListAsync(): void {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      this._getMockListData().then((response) => {
        this._renderList(response.value);
      });
    }
    else if (Environment.type == EnvironmentType.SharePoint ||
      Environment.type == EnvironmentType.ClassicSharePoint) {
      this._getListData()
        .then((response) => {
          this._renderList(response.value);
        });
    }
  }

}

