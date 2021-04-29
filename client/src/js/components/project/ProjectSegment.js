import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { showValidationErrorDialog } from '../../redux/actions';
import _ from 'lodash';

import Authorize from '../fragments/Authorize';
import MaterialCard from '../ui/MaterialCard';
import UIHeader from '../ui/UIHeader';
import PageSpinner from '../ui/PageSpinner';
import DataTableControl from '../ui/DataTableControl';
import { Button, Row, Col } from 'reactstrap';
import RatioTable from './RatioTable';
import EditSegmentFormFields from '../forms/EditSegmentFormFields';
import EditHighwayFormFields from '../forms/EditHighwayFormFields';
import EditElectoralDistrictFormFields from '../forms/EditElectoralDistrictFormFields';
import EditServiceAreaFormFields from '../forms/EditServiceAreaFormFields';
import EditDistrictFormFields from '../forms/EditDistrictFormFields';
import EditEconomicRegionFormFields from '../forms/EditEconomicRegionFormFields';
import ProjectFooterNav from './ProjectFooterNav';
import DetermineRatiosModal from './DetermineRatiosModal';

import useFormModal from '../hooks/useFormModal';
import * as api from '../../Api';
import * as Constants from '../../Constants';

const segmentTableColumns = [
  { heading: 'Segment start coordinates', key: 'startCoordinates', nosort: true },
  { heading: 'Segment end coordinates', key: 'endCoordinates', nosort: true },
  { heading: 'Description', key: 'description', nosort: true },
];

const highwayTableColumns = [
  { heading: 'Highway', key: 'ratioRecordName', nosort: true },
  { heading: 'Ratios', key: 'ratio', nosort: true },
];

const electoralDistrictTableColumns = [
  { heading: 'Electoral District', key: 'ratioRecordName', nosort: true },
  { heading: 'Ratios', key: 'ratio', nosort: true },
];

const economicRegionTableColumns = [
  { heading: 'Economic Region', key: 'ratioRecordName', nosort: true },
  { heading: 'Ratios', key: 'ratio', nosort: true },
];

const serviceAreaTableColumns = [
  { heading: 'Service Area', key: 'serviceAreaName', nosort: true },
  { heading: 'Ratios', key: 'ratio', nosort: true },
];

const districtTableColumns = [
  { heading: 'District', key: 'districtName', nosort: true },
  { heading: 'Ratios', key: 'ratio', nosort: true },
];

function ProjectSegment({ showValidationErrorDialog, ratioRecordTypes, match }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [ratiosData, setRatiosData] = useState({});
  const [detSegModalOpen, setDetSegModalOpen] = useState(false);

  useEffect(() => {
    api
      .getProjectLocations(match.params.id)
      .then((response) => {
        setData(response.data);
        setRatiosData(groupRatios(response.data?.ratios));
      })
      .catch((error) => {
        console.log(error);
        showValidationErrorDialog(error.response.data);
      })
      .finally(() => {
        setLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //segment helper functions
  const onDeleteSegmentClicked = (segmentId) => {
    api
      .deleteSegment(data.id, segmentId)
      .then(() => {
        refreshData();
      })
      .catch((error) => {
        console.log(error);
        showValidationErrorDialog(error.response.data);
      });
  };

  const addSegmentClicked = () => {
    segmentsFormModal.openForm(Constants.FORM_TYPE.ADD, { projectId: data.id, refreshData: refreshData });
  };

  const onEditSegmentClicked = (segmentId) => {
    segmentsFormModal.openForm(Constants.FORM_TYPE.EDIT, {
      projectId: data.id,
      segmentId: segmentId,
      refreshData: refreshData,
    });
  };

  const segmentsFormModal = useFormModal('Segments', <EditSegmentFormFields />, null, {
    size: 'xl',
    showModalHeader: false,
    showModalFooter: false,
  });

  //determine segment modal functions
  const detSegToggle = () => {
    setDetSegModalOpen(!detSegModalOpen);
  };

  //helper functions

  const refreshData = () => {
    api
      .getProjectLocations(match.params.id)
      .then((response) => {
        setData(response.data);
        setRatiosData(groupRatios(response.data?.ratios));
      })
      .catch((error) => {
        console.log(error);
        showValidationErrorDialog(error.response.data);
      });
  };

  const groupRatios = (ratios = []) => {
    //takes array of ratios and returns an Object grouped by Ratio Record Type.

    const camelCaseConvert = (item = {}) => {
      let keyName = ratioRecordTypes.find((ratioType) => ratioType.id === item.ratioRecordTypeLkupId).codeName;
      keyName = `${keyName[0].toLowerCase()}${keyName.slice(1, keyName.length)}`;
      keyName = keyName.replace(/\b \b/g, '');

      return keyName;
    };

    let groupedRatios = _.groupBy(ratios, camelCaseConvert);

    return groupedRatios;
  };

  if (loading) {
    return <PageSpinner />;
  }

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
            <Col xs="auto">{'Project Segments'}</Col>
            <Col>
              <Authorize requires={Constants.PERMISSIONS.PROJECT_W}>
                <Button
                  color="primary"
                  className="float-right"
                  onClick={addSegmentClicked}
                  title={'Add Segment or View Map'}
                >
                  + Add Segment / View Map
                </Button>
              </Authorize>
            </Col>
          </Row>
        </UIHeader>
        <DataTableControl
          dataList={data.segments}
          tableColumns={segmentTableColumns}
          deletable
          editable
          editPermissionName={Constants.PERMISSIONS.PROJECT_W}
          onEditClicked={onEditSegmentClicked}
          onDeleteClicked={onDeleteSegmentClicked}
          overflowY={true}
        />
      </MaterialCard>
      <MaterialCard>
        <UIHeader>
          <Row>
            <Col xs="auto">{'Project Ratios'}</Col>
            <Col>
              <Authorize requires={Constants.PERMISSIONS.PROJECT_W}>
                {data?.segments.length > 0 && (
                  <Button color="primary" className="float-right" onClick={detSegToggle}>
                    Determine Ratios Using Segments
                  </Button>
                )}
              </Authorize>
            </Col>
          </Row>
        </UIHeader>
        <Row>
          <Col xs={4}>
            <RatioTable
              title="Electoral Districts"
              ratioTypeName="Electoral District"
              dataList={ratiosData.electoralDistrict}
              projectId={data.id}
              tableColumns={electoralDistrictTableColumns}
              formModalFields={<EditElectoralDistrictFormFields />}
              refreshData={refreshData}
              overflowY={true}
            />
          </Col>
          <Col xs={4}>
            <RatioTable
              title="Highways"
              ratioTypeName="Highway"
              dataList={ratiosData.highway}
              projectId={data.id}
              tableColumns={highwayTableColumns}
              formModalFields={<EditHighwayFormFields />}
              refreshData={refreshData}
              overflowY={true}
            />
          </Col>
          <Col xs={4}>
            <RatioTable
              title="Service Areas"
              ratioTypeName="Service Area"
              dataList={ratiosData.serviceArea}
              projectId={data.id}
              tableColumns={serviceAreaTableColumns}
              formModalFields={<EditServiceAreaFormFields />}
              refreshData={refreshData}
              overflowY={true}
            />
          </Col>
        </Row>
        <div className="border-bottom mt-3 mb-3"></div>
        <Row>
          <Col xs={4}>
            <RatioTable
              title="Districts"
              ratioTypeName="District"
              dataList={ratiosData.district}
              projectId={data.id}
              tableColumns={districtTableColumns}
              formModalFields={<EditDistrictFormFields />}
              refreshData={refreshData}
              overflowY={true}
            />
          </Col>
          <Col xs={4}>
            <RatioTable
              title="Economic Regions"
              ratioTypeName="Economic Region"
              dataList={ratiosData.economicRegion}
              projectId={data.id}
              tableColumns={economicRegionTableColumns}
              formModalFields={<EditEconomicRegionFormFields />}
              refreshData={refreshData}
              overflowY={true}
            />
          </Col>
        </Row>
      </MaterialCard>
      {segmentsFormModal.formElement}
      <DetermineRatiosModal
        isOpen={detSegModalOpen}
        toggle={detSegToggle}
        projectId={data.id}
        dirty={data?.ratios.length > 0}
        refreshData={refreshData}
      />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    ratioRecordTypes: state.codeLookups.ratioRecordTypes,
  };
};

export default connect(mapStateToProps, { showValidationErrorDialog })(ProjectSegment);
