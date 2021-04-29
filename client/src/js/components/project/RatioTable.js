import React, { useState, useEffect } from 'react';
import { showValidationErrorDialog } from '../../redux/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Authorize from '../fragments/Authorize';
import UIHeader from '../ui/UIHeader';
import DataTableControl from '../ui/DataTableControl';
import { Button, Container, Row, Col } from 'reactstrap';
import MouseoverTooltip from '../ui/MouseoverTooltip';

import useFormModal from '../hooks/useFormModal';
import * as api from '../../Api';
import * as Constants from '../../Constants';

const RatioTable = ({
  showValidationErrorDialog,
  title,
  ratioTypeName,
  tableColumns,
  formModalFields,
  projectId,
  dataList = [],
  refreshData,
  overflowY,
}) => {
  const [ratioTotal, setRatioTotal] = useState(0);
  const [warning, setWarning] = useState(false);
  //used to generate ID for popover. Need to remove all spaces from title
  const id = title.replace(/\b \b/g, '');

  useEffect(() => {
    ratioCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataList]);

  const myHandleFormSubmit = (values, formType) => {
    if (!formModal.submitting) {
      formModal.setSubmitting(true);
      if (formType === Constants.FORM_TYPE.ADD) {
        api
          .postRatio(projectId, values)
          .then(() => {
            formModal.closeForm();
            refreshData();
          })
          .catch((error) => {
            console.log(error.response);
            showValidationErrorDialog(error.response.data);
          })
          .finally(() => formModal.setSubmitting(false));
      } else if (formType === Constants.FORM_TYPE.EDIT) {
        api
          .putRatio(projectId, values.id, values)
          .then(() => {
            formModal.closeForm();
            refreshData();
          })
          .catch((error) => {
            console.log(error.response);
            showValidationErrorDialog(error.response.data);
          })
          .finally(() => formModal.setSubmitting(false));
      }
    }
  };

  const onAddClicked = () => {
    formModal.openForm(Constants.FORM_TYPE.ADD, { ratioTypeName: ratioTypeName });
  };

  const onEditClicked = (ratioId) => {
    formModal.openForm(Constants.FORM_TYPE.EDIT, { ratioId, projectId });
  };

  const onDeleteClicked = (ratioId) => {
    api
      .deleteRatio(projectId, ratioId)
      .then(() => {
        refreshData();
      })
      .catch((error) => console.log(error));
  };

  const ratioCheck = () => {
    //checks if ratios add up to 1.
    let total = dataList.reduce((acc, val) => acc + (val.ratio * 100) / 100, 0);
    //needed to round off numbers to 2 decimal places. Fixes floating error bug.
    total = Math.round(total * 100) / 100;
    setRatioTotal(total);
    setWarning(total !== 1);
  };

  const formModal = useFormModal(title, formModalFields, myHandleFormSubmit, { saveCheck: true });

  return (
    <Container>
      <UIHeader>
        <Row>
          <Col xs="8">
            {title}
            {dataList.length !== 0 && warning && (
              <MouseoverTooltip id={`ratio-${id}`} color="warning" icon={`exclamation-circle`}>
                <div>
                  Sum of {title} ratios needs to be 1. Current total is <strong>{ratioTotal}</strong>
                </div>
              </MouseoverTooltip>
            )}
          </Col>
          <Col>
            <Authorize requires={Constants.PERMISSIONS.PROJECT_W}>
              <Button color="primary" className="float-right" onClick={onAddClicked}>
                + Add
              </Button>
            </Authorize>
          </Col>
        </Row>
      </UIHeader>
      <DataTableControl
        dataList={dataList}
        tableColumns={tableColumns}
        editable
        deletable
        editPermissionName={Constants.PERMISSIONS.PROJECT_W}
        onEditClicked={onEditClicked}
        onDeleteClicked={onDeleteClicked}
        overflowY={overflowY}
      />
      {formModal.formElement}
    </Container>
  );
};

export default connect(null, { showValidationErrorDialog })(RatioTable);

RatioTable.propTypes = {
  title: PropTypes.string.isRequired, //title for the dialog
  ratioTypeName: PropTypes.string.isRequired, //used to grab ratioRecordTypeLkupId in the FormFields
  projectId: PropTypes.number.isRequired,
  tableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      heading: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      nosort: PropTypes.bool,
      badge: PropTypes.shape({
        //badge will show active/inactive string based on boolean value
        active: PropTypes.string.isRequired,
        inactive: PropTypes.string.isRequired,
      }),
      //link will be the url path of where you want to go. ie. /projects/:id <- will look at dataList item for id attribute
      link: PropTypes.shape({
        path: PropTypes.string,
        key: PropTypes.string, //will display what is in item[key]. Key takes precedence over heading.
        heading: PropTypes.string, //will display this string if item[key] doesn't exist.
      }),
      currency: PropTypes.bool, //if true then format values as currency
      thousandSeparator: PropTypes.bool, //if true then format values with thousand comma separators
    })
  ).isRequired,
  formModalFields: PropTypes.element.isRequired, //these will be displayed when dialog opens
  refreshData: PropTypes.func.isRequired, //used to refresh page when data is changed
  overflowY: PropTypes.bool, //sets whether or not to enable Y scroll based on max-height 25vh
};
