import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import SingleDropdownField from '../ui/SingleDropdownField';
import PageSpinner from '../ui/PageSpinner';
import { FormRow, FormMultiRow, FormInput, FormCheckboxInput } from './FormInputs';

import * as Constants from '../../Constants';
import * as api from '../../Api';

const defaultValues = {
  projectNumber: '',
  projectName: '',
  description: '',
  scope: '',
  capIndxLkupId: undefined,
  regionId: undefined,
  projectMgrLkupId: null,
  nearstTwnLkupId: null,
  rcLkupId: undefined,
  endDate: undefined,
};

const validationSchema = Yup.object({
  projectNumber: Yup.string().required(
    'Project number required. You may assign a temporary value that can be updated once the project number is known?'
  ),
  projectName: Yup.string().required('Project name required'),
  regionId: Yup.number().required('Region required'),
  capIndxLkupId: Yup.number().required('Capital Index required'),
  rcLkupId: Yup.number().nullable().required('RC Number required'),
});

const EditProjectFormFields = ({
  setInitialValues,
  formValues,
  setValidationSchema,
  projectId,
  formType,
  capitalIndexes,
  userRegionIds,
  projectMgrs,
  nearestTowns,
  rcNumbers,
  autofocus,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInitialValues(defaultValues);
    setValidationSchema(validationSchema);

    if (formType === Constants.FORM_TYPE.EDIT) {
      setLoading(true);
      api.getProject(projectId).then((response) => {
        setInitialValues({ ...response.data, endDate: response.data.endDate ? true : false });
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || formValues === null) return <PageSpinner />;

  return (
    <React.Fragment>
      <FormMultiRow>
        <FormRow name="projectNumber" label="Project Number*" helper="projectNumber">
          <FormInput
            type="text"
            name="projectNumber"
            placeholder="Project Number"
            id="projectNumber"
            innerRef={autofocus}
          />
        </FormRow>
        <FormRow name="projectName" label="Project Name*" helper="projectName">
          <FormInput type="text" name="projectName" placeholder="Project Name" id="projectName" />
        </FormRow>
      </FormMultiRow>
      <FormMultiRow>
        <FormRow name="regionId" label="MoTI Region*">
          <SingleDropdownField items={userRegionIds} name="regionId" />
        </FormRow>
        <FormRow name="nearstTwnLkupId" label="Nearest Town" helper="nearstTwnLkupId">
          <SingleDropdownField items={nearestTowns} name="nearstTwnLkupId" searchable clearable />
        </FormRow>
      </FormMultiRow>
      <FormRow name="rcLkupId" label="RC Number*" helper="rcLkupId">
        <SingleDropdownField items={rcNumbers} name="rcLkupId" searchable />
      </FormRow>
      <FormRow name="projectMgrLkupId" label="Project Manager" helper="projectMgrLkupId">
        <SingleDropdownField items={projectMgrs} name="projectMgrLkupId" clearable searchable />
      </FormRow>
      <FormRow name="capIndxLkupId" label="Capital Index*" helper="capIndxLkupId">
        <SingleDropdownField items={capitalIndexes} name="capIndxLkupId" searchable />
      </FormRow>
      <FormRow name="description" label="Project Description" helper="description">
        <FormInput type="textarea" rows={5} name="description" placeholder="Project Description" id="description" />
      </FormRow>
      <FormRow name="scope" label="Project Scope" helper="scope">
        <FormInput type="textarea" rows={5} name="scope" placeholder="Project Scope" id="scope" />
      </FormRow>
      <FormRow name="endDate" label="Project Closed" helper="endDate">
        <FormCheckboxInput name="endDate" type="checkbox" />
      </FormRow>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    capitalIndexes: Object.values(state.codeLookups.capitalIndexes),
    userRegionIds: Object.values(state.user.current.regions),
    projectMgrs: Object.values(state.codeLookups.projectMgrs),
    nearestTowns: Object.values(state.codeLookups.nearestTowns),
    rcNumbers: Object.values(state.codeLookups.rcNumbers),
  };
};

export default connect(mapStateToProps, null)(EditProjectFormFields);
