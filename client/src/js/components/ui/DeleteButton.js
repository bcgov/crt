import React, { useState, useEffect } from 'react';
import { Popover, PopoverHeader, PopoverBody, ButtonGroup, Button } from 'reactstrap';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';

import FontAwesomeButton from './FontAwesomeButton';

import * as Constants from '../../Constants';

const DeleteButton = ({
  buttonId,
  children,
  itemId,
  defaultEndDate,
  onDeleteClicked,
  onComplete,
  permanentDelete,
  easyDelete,
  defaultButtonText,
  altButtonText,
  isActive, //needed for elements which do not use endDate for disable
  ...props
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(false);
  const [focusClassName, setFocusClassName] = useState('');
  const [buttonText, setButtonText] = useState(defaultButtonText || 'Disable');

  useEffect(() => {
    if (defaultEndDate) {
      setDate(moment(defaultEndDate));
      setButtonText(easyDelete ? altButtonText || 'Activate' : 'Update');
    } else {
      setDate(null);
    }
  }, [altButtonText, defaultEndDate, popoverOpen, easyDelete]);

  useEffect(() => {
    if (isActive === false) {
      setButtonText(easyDelete ? altButtonText || 'Activate' : 'Update');
    }
  }, [altButtonText, isActive, easyDelete]);

  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  const handleDatePickerFocusChange = (focused) => {
    setFocusedInput(focused);
    focused ? setFocusClassName('focused') : setFocusClassName('');
  };

  const toggleDate = () => {
    //needed for easyDelete functionality
    if (date === null) {
      return moment().format(Constants.DATE_DISPLAY_FORMAT);
    }

    return null;
  };

  const handleConfirmDelete = () => {
    if (easyDelete) {
      onDeleteClicked(itemId, toggleDate(), permanentDelete);
    } else {
      onDeleteClicked(itemId, date, permanentDelete);
    }
  };

  const iconName = permanentDelete ? 'trash-alt' : 'ban';

  return (
    <React.Fragment>
      <FontAwesomeButton
        color={moment().isSameOrAfter(date, 'day') || isActive === false ? 'secondary' : 'danger'}
        icon={iconName}
        id={buttonId}
        {...props}
      />
      <Popover placement="auto-start" isOpen={popoverOpen} target={buttonId} toggle={togglePopover} trigger="legacy">
        <PopoverHeader>Are you sure?</PopoverHeader>
        <PopoverBody>
          {permanentDelete ? (
            <div>
              This will <strong>permanently</strong> delete the record.
            </div>
          ) : (
            easyDelete || (
              <div className={`DatePickerWrapper ${focusClassName}`}>
                <SingleDatePicker
                  id={`${buttonId}_endDate`}
                  date={date}
                  onDateChange={(date) => setDate(date)}
                  focused={focusedInput}
                  onFocusChange={({ focused }) => handleDatePickerFocusChange(focused)}
                  hideKeyboardShortcutsPanel={true}
                  numberOfMonths={1}
                  small
                  block
                  noBorder
                  showDefaultInputIcon={true}
                  showClearDate={true}
                  inputIconPosition="after"
                  placeholder="End Date"
                  openDirection="up"
                />
              </div>
            )
          )}

          <div className="text-right mt-3">
            <ButtonGroup>
              <Button color="danger" size="sm" onClick={handleConfirmDelete}>
                {permanentDelete ? 'Delete' : buttonText}
              </Button>
              <Button color="secondary" size="sm" onClick={togglePopover}>
                Cancel
              </Button>
            </ButtonGroup>
          </div>
        </PopoverBody>
      </Popover>
    </React.Fragment>
  );
};

export default DeleteButton;
