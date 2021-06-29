import * as React from 'react';
import styles from './DisplayListItems.module.scss';
import { IDisplayListItemsProps } from './IDisplayListItemsProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class DisplayListItems extends React.Component<IDisplayListItemsProps, {}> {
  public render(): React.ReactElement<IDisplayListItemsProps> {
    return (
      <div className={ styles.displayListItems }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>This is a SpFx Custom Part!</span>
              <p className={ styles.subTitle }>It's built using React!.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <p className={ styles.description }>{escape(this.props.test)}</p>
              <p className={ styles.description }>{this.props.test1}</p>
              <p className={ styles.description }>{escape(this.props.test2)}</p>
              <p className={ styles.description }>{this.props.test3}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
