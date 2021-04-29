import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { showValidationErrorDialog } from '../../redux/actions';
import ProjectFooterNav from './ProjectFooterNav';

//components
import Authorize from '../fragments/Authorize';
import MaterialCard from '../ui/MaterialCard';
import UIHeader from '../ui/UIHeader';
import PageSpinner from '../ui/PageSpinner';
import DataTableControl from '../ui/DataTableControl';
import SingleDropdown from '../ui/SingleDropdown';
import { Button, Row, Col } from 'reactstrap';
import EditTenderFormFields from '../forms/EditTenderFormFields';
import EditQtyAccmpFormFields from '../forms/EditQtyAccmpFormFields';

import useFormModal from '../hooks/useFormModal';
import * as api from '../../Api';
import * as Constants from '../../Constants';
import { arrayFormatter } from '../../utils';

const ProjectTender = ({ match, fiscalYears, showValidationErrorDialog }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [qtyOrAccmpFilter, setqtyOrAccmpFilter] = useState('ALL');
  const [fiscalYearsFilter, setFiscalYearsFilter] = useState('ALL');

  useEffect(() => {
    api
      .getProjectTender(match.params.id)
      .then((response) => {
        let data = response.data;
        data = {
          ...data,
          qtyAccmps: arrayFormatter(data.qtyAccmps).sortBy(sortFunctionFiscalYear).get(),
          tenders: arrayFormatter(data.tenders)
            .changeDateFormat(Constants.DATE_DISPLAY_FORMAT)
            .roundPercentage('ministryEstPerc')
            .get(),
        };

        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
        showValidationErrorDialog(error.response.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const projectTenderTableColumns = [
    { heading: 'Tender #', key: 'tenderNumber', nosort: true },
    { heading: 'Planned Date', key: 'plannedDate', nosort: true },
    { heading: 'Actual Date', key: 'actualDate', nosort: true },
    { heading: 'Ministry Estimate', key: 'tenderValue', currency: true, nosort: true },
    { heading: 'Winning Contractor', key: 'winningCntrctr', nosort: true },
    { heading: 'Winning Bid', key: 'bidValue', currency: true, nosort: true },
    { heading: '%Min.Est.', key: 'ministryEstPerc', nosort: true },
    { heading: 'Comment', key: 'comment', nosort: true },
  ];

  const qaTableColumns = [
    { heading: 'Fiscal Year', key: 'fiscalYear', nosort: true },
    { heading: 'Accomplishment/Quantity', key: 'qtyAccmpName', nosort: true },
    { heading: 'Forecast', key: 'forecast', thousandSeparator: true, nosort: true },
    { heading: 'Schedule7', key: 'schedule7', thousandSeparator: true, nosort: true },
    { heading: 'Actual', key: 'actual', thousandSeparator: true, nosort: true },
    { heading: 'Comment', key: 'comment', nosort: true },
  ];

  const qtyAccmpArray = [
    { id: 'ALL', name: 'Show All Qty/Accmp' },
    { id: 'ACCOMPLISHMENT', name: 'Accomplishment' },
    { id: 'QUANTITY', name: 'Quantity' },
  ];

  //Tender edit, delete, put, post functions.
  const onAddTenderClicked = () => {
    tendersFormModal.openForm(Constants.FORM_TYPE.ADD);
  };

  const onTenderEditClicked = (tenderId) => {
    tendersFormModal.openForm(Constants.FORM_TYPE.EDIT, { tenderId, projectId: data.id });
  };

  const onTenderCloneClicked = (tenderId) => {
    tendersFormModal.openForm(Constants.FORM_TYPE.CLONE, { tenderId, projectId: data.id });
  };

  const onTenderDeleteClicked = (tenderId) => {
    api
      .deleteTender(data.id, tenderId)
      .then(() => {
        refreshData();
      })
      .catch((error) => {
        console.log(error.response);
        showValidationErrorDialog(error.response.data);
      });
  };

  const handleEditTenderFormSubmit = (values, formType) => {
    if (!tendersFormModal.submitting) {
      tendersFormModal.setSubmitting(true);
    }

    if (formType === Constants.FORM_TYPE.ADD || formType === Constants.FORM_TYPE.CLONE) {
      api
        .postTender(data.id, values)
        .then(() => {
          tendersFormModal.closeForm();
          refreshData();
        })
        .catch((error) => {
          console.log(error.response);
          showValidationErrorDialog(error.response.data);
        })
        .finally(() => tendersFormModal.setSubmitting(false));
    } else if (formType === Constants.FORM_TYPE.EDIT) {
      api
        .putTender(data.id, values.id, values)
        .then(() => {
          tendersFormModal.closeForm();
          refreshData();
        })
        .catch((error) => {
          console.log(error.response);
          showValidationErrorDialog(error.response.data);
        })
        .finally(() => tendersFormModal.setSubmitting(false));
    }
  };

  //Quantity Accomplishments edit, delete, put, post functions.
  const onAddQAClicked = () => {
    qtyAccmpFormModal.openForm(Constants.FORM_TYPE.ADD);
  };

  const onQAEditClicked = (qtyAccmpId) => {
    qtyAccmpFormModal.openForm(Constants.FORM_TYPE.EDIT, { qtyAccmpId, projectId: data.id });
  };

  const onQACloneClicked = (qtyAccmpId) => {
    qtyAccmpFormModal.openForm(Constants.FORM_TYPE.CLONE, { qtyAccmpId, projectId: data.id });
  };

  const onQADeleteClicked = (qtyAccmpId) => {
    api
      .deleteQtyAccmp(data.id, qtyAccmpId)
      .then(() => refreshData())
      .catch((error) => {
        console.log(error.response);
        showValidationErrorDialog(error.response.data);
      });
  };

  const handleEditQtyAccmptFormSubmit = (values, formType) => {
    if (!qtyAccmpFormModal.submitting) {
      qtyAccmpFormModal.setSubmitting(true);
      if (formType === Constants.FORM_TYPE.ADD || formType === Constants.FORM_TYPE.CLONE) {
        api
          .postQtyAccmp(data.id, values)
          .then(() => {
            qtyAccmpFormModal.closeForm();
            refreshData();
          })
          .catch((error) => {
            console.log(error.response);
            showValidationErrorDialog(error.response.data);
          })
          .finally(() => qtyAccmpFormModal.setSubmitting(false));
      } else if (formType === Constants.FORM_TYPE.EDIT) {
        api
          .putQtyAccmp(data.id, values.id, values)
          .then(() => {
            qtyAccmpFormModal.closeForm();
            refreshData();
          })
          .catch((error) => {
            console.log(error.response);
            showValidationErrorDialog(error.response.data);
          })
          .finally(() => qtyAccmpFormModal.setSubmitting(false));
      }
    }
  };

  //helper functions

  const onQtyAccmpFilterChange = (qtyAccmpName) => {
    setqtyOrAccmpFilter(qtyAccmpName);
  };

  const onFiscalYearFilterChange = (fiscalId) => {
    const result =
      fiscalYears.find((fiscalYearItem) => {
        return fiscalYearItem.id === fiscalId;
      })?.codeName || 'ALL';
    setFiscalYearsFilter(result);
  };

  const refreshData = () => {
    api
      .getProjectTender(data.id)
      .then((response) => {
        let data = response.data;
        data = {
          ...data,
          qtyAccmps: arrayFormatter(data.qtyAccmps).sortBy(sortFunctionFiscalYear).get(),
          tenders: arrayFormatter(data.tenders)
            .changeDateFormat(Constants.DATE_DISPLAY_FORMAT)
            .roundPercentage('ministryEstPerc')
            .get(),
        };

        setData(data);
      })
      .catch((error) => {
        console.log(error.response);
        showValidationErrorDialog(error.response.data);
      });
  };

  const sortFunctionFiscalYear = (a, b) => {
    let displayOrderYearA = fiscalYears.find((year) => year.codeName === a.fiscalYear).displayOrder;
    let displayOrderYearB = fiscalYears.find((year) => year.codeName === b.fiscalYear).displayOrder;

    return displayOrderYearA - displayOrderYearB;
  };

  const tendersFormModal = useFormModal('Tender Details', <EditTenderFormFields />, handleEditTenderFormSubmit, {
    saveCheck: true,
  });
  const qtyAccmpFormModal = useFormModal(
    'Quantities and Accomplishments',
    <EditQtyAccmpFormFields />,
    handleEditQtyAccmptFormSubmit,
    { saveCheck: true }
  );

  if (loading) return <PageSpinner />;

  return (
    <React.Fragment>
      <ProjectFooterNav projectId={data.id} />
      <UIHeader>
        <MaterialCard>
          <Col xs="auto">{data.projectNumber}</Col>
        </MaterialCard>
      </UIHeader>
      <MaterialCard>
        <UIHeader>
          <Row>
            <Col xs="auto">Project Tender Details</Col>
            <Col>
              <Authorize requires={Constants.PERMISSIONS.PROJECT_W}>
                <Button color="primary" className="float-right" onClick={onAddTenderClicked}>
                  + Add
                </Button>
              </Authorize>
            </Col>
          </Row>
        </UIHeader>
        <DataTableControl
          dataList={data.tenders}
          tableColumns={projectTenderTableColumns}
          editable
          deletable
          cloneable
          onCloneClicked={onTenderCloneClicked}
          editPermissionName={Constants.PERMISSIONS.PROJECT_W}
          onEditClicked={onTenderEditClicked}
          onDeleteClicked={onTenderDeleteClicked}
        />
      </MaterialCard>
      <MaterialCard>
        <UIHeader>
          <Row>
            <Col xs="auto">Quantities/Accomplishments</Col>
            <Col xs={3}>
              <SingleDropdown
                items={qtyAccmpArray}
                handleOnChange={onQtyAccmpFilterChange}
                defaultTitle="Show All Qty/Accmp"
              />
            </Col>
            <Col xs={3}>
              <SingleDropdown
                items={[{ id: 'ALL', name: 'Show All Fiscal Years' }].concat(
                  arrayFormatter(data.qtyAccmps).findValidFiscalYears(fiscalYears).get()
                )}
                handleOnChange={onFiscalYearFilterChange}
                defaultTitle="Show All Fiscal Years"
              />
            </Col>
            <Col>
              <Authorize requires={Constants.PERMISSIONS.PROJECT_W}>
                <Button color="primary" className="float-right" onClick={onAddQAClicked}>
                  + Add
                </Button>
              </Authorize>
            </Col>
          </Row>
        </UIHeader>
        <DataTableControl
          dataList={arrayFormatter(data.qtyAccmps)
            .displayAfterFilter(qtyOrAccmpFilter, 'qtyAccmpType')
            .displayAfterFilter(fiscalYearsFilter, 'fiscalYear')
            .get()}
          tableColumns={qaTableColumns}
          editable
          deletable
          cloneable
          editPermissionName={Constants.PERMISSIONS.PROJECT_W}
          onEditClicked={onQAEditClicked}
          onDeleteClicked={onQADeleteClicked}
          onCloneClicked={onQACloneClicked}
        />
      </MaterialCard>
      {tendersFormModal.formElement}
      {qtyAccmpFormModal.formElement}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    fiscalYears: state.codeLookups.fiscalYears,
  };
};

export default connect(mapStateToProps, { showValidationErrorDialog })(ProjectTender);
