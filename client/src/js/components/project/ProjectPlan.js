import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { showValidationErrorDialog } from '../../redux/actions';

//components
import Authorize from '../fragments/Authorize';
import MaterialCard from '../ui/MaterialCard';
import UIHeader from '../ui/UIHeader';
import PageSpinner from '../ui/PageSpinner';
import DataTableControl from '../ui/DataTableControl';
import { Button, Row, Col } from 'reactstrap';
import SingleDropdown from '../ui/SingleDropdown';
import { DisplayRow, DisplayMultiRow, ColumnGroup, ColumnGroupWithMarkdown } from './ProjectDisplayHelper';
import FontAwesomeButton from '../ui/FontAwesomeButton';
import NumberFormat from 'react-number-format';
import EditFinTargetFormFields from '../forms/EditFinTargetFormFields';
import EditAnnouncementFormFields from '../forms/EditAnnouncementFormFields';
import ProjectFooterNav from './ProjectFooterNav';

import useFormModal from '../hooks/useFormModal';
import * as api from '../../Api';
import * as Constants from '../../Constants';
import { arrayFormatter } from '../../utils';

const ProjectPlan = ({ match, fiscalYears, phases, showValidationErrorDialog }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [fiscalYearsFilter, setFiscalYearsFilter] = useState('ALL');

  useEffect(() => {
    api
      .getProjectPlan(match.params.id)
      .then((response) => {
        let data = response.data;
        data = {
          ...data,
          finTargets: arrayFormatter(data.finTargets).sortBy(sortFunctionByFiscalAndPecos).get(),
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

  const finTargetTableColumns = [
    { heading: 'Fiscal Year', key: 'fiscalYear', nosort: true },
    { heading: 'Project Phase', key: 'projectPhase', nosort: true },
    { heading: 'Element', key: 'element', nosort: true },
    { heading: 'Funding Type', key: 'fundingType', nosort: true },
    { heading: 'Amount', key: 'amount', currency: true, nosort: true },
    { heading: 'Description', key: 'description', nosort: true },
  ];

  //Financial Target edit, delete, put, post functions.
  const addFinTargetClicked = () => {
    finTargetsFormModal.openForm(Constants.FORM_TYPE.ADD);
  };

  const onFinTargetEditClicked = (finTargetId) => {
    finTargetsFormModal.openForm(Constants.FORM_TYPE.EDIT, { finTargetId, projectId: data.id });
  };

  const onFinTargetCloneClicked = (finTargetId) => {
    finTargetsFormModal.openForm(Constants.FORM_TYPE.CLONE, { finTargetId, projectId: data.id });
  };

  const onFinTargetDeleteClicked = (finTargetId) => {
    api
      .deleteFinTarget(data.id, finTargetId)
      .then(() => {
        refreshData();
      })
      .catch((error) => {
        console.log(error.response);
        showValidationErrorDialog(error.response.data);
      });
  };

  const handleEditFinTargetFormSubmit = (values, formType) => {
    if (!finTargetsFormModal.submitting) {
      finTargetsFormModal.setSubmitting(true);
      if (formType === Constants.FORM_TYPE.ADD || formType === Constants.FORM_TYPE.CLONE) {
        api
          .postFinTarget(data.id, values)
          .then(() => {
            finTargetsFormModal.closeForm();
            refreshData();
          })
          .catch((error) => {
            console.log(error.response);
            showValidationErrorDialog(error.response.data);
          })
          .finally(() => finTargetsFormModal.setSubmitting(false));
      } else if (formType === Constants.FORM_TYPE.EDIT) {
        api
          .putFinTarget(data.id, values.id, values)
          .then(() => {
            finTargetsFormModal.closeForm();
            refreshData();
          })
          .catch((error) => {
            console.log(error.response);
            showValidationErrorDialog(error.response.data);
          })
          .finally(() => finTargetsFormModal.setSubmitting(false));
      }
    }
  };

  //Announcements Functions
  const handleAnnouncementEditFormClick = (projectId) => {
    announcementFormModal.openForm(Constants.FORM_TYPE.EDIT, { projectId: projectId });
  };

  const handleAnnouncementEditFormSubmit = (values) => {
    if (!announcementFormModal.submitting) {
      announcementFormModal.setSubmitting(true);
      api
        .putProject(values.id, { ...values })
        .then(() => {
          announcementFormModal.closeForm();
          refreshData();
        })
        .catch((error) => {
          console.log(error.response);
          showValidationErrorDialog(error.response.data);
        })
        .finally(() => announcementFormModal.setSubmitting(false));
    }
  };

  //filter/sort helper functions
  const onFiscalYearFilterChange = (fiscalId) => {
    const result =
      fiscalYears.find((fiscalYearItem) => {
        return fiscalYearItem.id === fiscalId;
      })?.codeName || 'ALL';
    setFiscalYearsFilter(result);
  };

  const sortFunctionByFiscalAndPecos = (a, b) => {
    let displayOrderYearA = fiscalYears.find((year) => year.codeName === a.fiscalYear).displayOrder;
    let displayOrderYearB = fiscalYears.find((year) => year.codeName === b.fiscalYear).displayOrder;
    let displayOrderPhaseA = phases.find((phase) => phase.name === a.projectPhase).displayOrder;
    let displayOrderPhaseB = phases.find((phase) => phase.name === b.projectPhase).displayOrder;

    return displayOrderYearA - displayOrderYearB || displayOrderPhaseA - displayOrderPhaseB;
  };

  const sumByFiscalYear = (items = []) => {
    return items.reduce((accumulator, finTarget) => accumulator + finTarget?.amount, 0);
  };

  const refreshData = () => {
    api
      .getProjectPlan(data.id)
      .then((response) => {
        let data = response.data;
        data = {
          ...data,
          finTargets: arrayFormatter(data.finTargets).sortBy(sortFunctionByFiscalAndPecos).get(),
        };

        setData(data);
      })
      .catch((error) => {
        console.log(error.response);
        showValidationErrorDialog(error.response.data);
      });
  };

  const finTargetsFormModal = useFormModal(
    'Financial Planning Targets',
    <EditFinTargetFormFields />,
    handleEditFinTargetFormSubmit,
    { saveCheck: true }
  );

  const announcementFormModal = useFormModal(
    'Announcement Details',
    <EditAnnouncementFormFields />,
    handleAnnouncementEditFormSubmit,
    { saveCheck: true, size: 'lg' }
  );

  if (loading) return <PageSpinner />;

  return (
    <React.Fragment>
      <ProjectFooterNav projectId={data.id} />
      <UIHeader>
        <MaterialCard>
          <Row>
            <Col xs="auto">{data.projectNumber}</Col>
          </Row>
        </MaterialCard>
      </UIHeader>
      <MaterialCard>
        <UIHeader>
          <Row>
            <Col xs="auto">Financial Planning Targets</Col>
            <Col xs={3}>
              <SingleDropdown
                items={[{ id: 'ALL', name: 'Show All Fiscal Years' }].concat(
                  arrayFormatter(data.finTargets).findValidFiscalYears(fiscalYears).get()
                )}
                handleOnChange={onFiscalYearFilterChange}
                defaultTitle="Show All Fiscal Years"
              />
            </Col>
            <Col>
              <Authorize requires={Constants.PERMISSIONS.PROJECT_W}>
                <Button color="primary" className="float-right" onClick={addFinTargetClicked}>
                  + Add
                </Button>
              </Authorize>
            </Col>
          </Row>
        </UIHeader>
        <DataTableControl
          dataList={arrayFormatter(data.finTargets).displayAfterFilter(fiscalYearsFilter, 'fiscalYear').get()}
          tableColumns={finTargetTableColumns}
          editable
          deletable
          cloneable
          editPermissionName={Constants.PERMISSIONS.PROJECT_W}
          onEditClicked={onFinTargetEditClicked}
          onDeleteClicked={onFinTargetDeleteClicked}
          onCloneClicked={onFinTargetCloneClicked}
        />
        <Row>
          <Col className="text-right">
            <strong>Total Project Funding </strong>
            <NumberFormat
              value={sumByFiscalYear(
                arrayFormatter(data.finTargets).displayAfterFilter(fiscalYearsFilter, 'fiscalYear').get()
              )}
              prefix="$"
              thousandSeparator={true}
              displayType="text"
            />
          </Col>
        </Row>
      </MaterialCard>
      <MaterialCard>
        <UIHeader>
          <Row>
            <Col xs="auto">Public Project Information</Col>
            <Col>
              <Authorize requires={Constants.PERMISSIONS.PROJECT_W}>
                <FontAwesomeButton
                  icon="edit"
                  className="float-right"
                  onClick={() => handleAnnouncementEditFormClick(data.id)}
                  title="Edit Record"
                  iconSize="lg"
                />
              </Authorize>
            </Col>
          </Row>
        </UIHeader>
        <DisplayMultiRow>
          <ColumnGroup
            name="Announcement Value"
            label={
              <NumberFormat value={data?.anncmentValue || ''} prefix="$" thousandSeparator={true} displayType="text" />
            }
            helper="anncmentValue"
            sm={4}
          />
          <ColumnGroup
            name="C-035 Value"
            label={
              <NumberFormat value={data?.c035Value || ''} prefix="$" thousandSeparator={true} displayType="text" />
            }
            helper="c035Value"
          />
          <ColumnGroup
            name="Estimated Value"
            label={
              <NumberFormat value={data?.estimatedValue || ''} prefix="$" thousandSeparator={true} displayType="text" />
            }
            helper="estimatedValue"
          />
        </DisplayMultiRow>
        <DisplayRow>
          <ColumnGroupWithMarkdown
            name="Announcement Comment"
            label={data.anncmentComment?.replace(/\n/g, '  \n')}
            helper="anncmentComment"
          />
        </DisplayRow>
      </MaterialCard>
      {finTargetsFormModal.formElement}
      {announcementFormModal.formElement}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    fiscalYears: state.codeLookups.fiscalYears,
    phases: state.codeLookups.phases,
  };
};

export default connect(mapStateToProps, { showValidationErrorDialog })(ProjectPlan);
