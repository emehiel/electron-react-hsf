import { useState, useEffect } from 'react';

import NavDrawer from './components/NavDrawer';
import Footer from './components/Footer';
import ScenarioParameters from './components/ScenarioParameters';
import TaskTable from './components/TaskTable';
import ModelGraph from './components/ModelGraph';
import DependencyGraph from './components/DependencyGraph';
import ConstraintsTable from './components/ConstraintsTable';
import ConfirmationModal from './components/ConfirmationModal';
import SaveConfirmationModal from './components/SaveConfirmationModal';
import ErrorModal from './components/ErrorModal';
import { useNodesState, useEdgesState } from 'reactflow';

import { initSimulationInput, aeolusSimulationInput } from './aeolus_config/initSimulationInput';
import flattenedInitTasks from './aeolus_config/initTaskList';
import initModel from './aeolus_config/initModel';

import { parseModel } from './utils/parseModel';
import parseJSONFile from './utils/parseJSONFile';
import parseCSVFile from './utils/parseCSVFile';
import buildDownloadJSON from './utils/buildDownloadJSON';
import buildSimFile from './utils/buildSimFile';
import parseSimFile from './utils/parseSimFile';
import downloadCSV from './utils/downloadCSV';
import createModelNodesEdges from './utils/createModelNodesEdges';
import createDependencyNodesEdges from './utils/createDependencyNodesEdges';

const { systemComponents, systemDependencies, systemEvaluator, systemConstraints } = parseModel(initModel);

export default function App() {
  // Scenario and Tasks state variables
  const [activeStep, setActiveStep] = useState('Scenario');
  const [simulationInput, setSimulationInput] = useState(aeolusSimulationInput);
  const [taskList, setTaskList] = useState(flattenedInitTasks);

  // Model state variables
  const [componentList, setComponentList] = useState(systemComponents);
  const [dependencyList, setDependencyList] = useState(systemDependencies);
  const [evaluator, setEvaluator] = useState(systemEvaluator);
  const [constraints, setConstraints] = useState(systemConstraints);

  // React Flow state variables
  const { initialNodes, initialEdges } = createModelNodesEdges(componentList, dependencyList);
  const [modelNodes, setModelNodes, onModelNodesChange] = useNodesState(initialNodes);
  const [modelEdges, setModelEdges, onModelEdgesChange] = useEdgesState(initialEdges);
  const { initialDependencyNodes, initialDependencyEdges } = createDependencyNodesEdges(componentList, dependencyList);
  const [dependencyNodes, setDependencyNodes, onDependencyNodesChange] = useNodesState(initialDependencyNodes);
  const [dependencyEdges, setDependencyEdges, onDependencyEdgesChange] = useEdgesState(initialDependencyEdges);

  const [filePath, setFilePath] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationHandler, setConfirmationHandler] = useState(() => {});
  const [saveConfirmationModalOpen, setSaveConfirmationModalOpen] = useState(false);

  // TO DO: Create context provider for all errors
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [modelErrors, setModelErrors] = useState({});

  // Bundling state methods
  const setStateMethods = {
    setSimulationInput,
    setTaskList,
    setComponentList,
    setDependencyList,
    setEvaluator,
    setConstraints,
  };

  const savedStateMethods = {
    ...setStateMethods,
    setModelNodes,
    setModelEdges,
    setErrorMessage,
    setModelErrors,
  };

  const navDrawerWidth = 220;
  const [ navOpen, setNavOpen ] = useState(true);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  }

  // Called when user selects a file to open OR upload using the Electron File Menu
  const handleFileUpload = (fileType, fileName, content) => {
    setConfirmationHandler(() => () => handleUploadConfirm(fileType, null, fileName, content));
    setConfirmationModalOpen(true);
  };

  const handleFileOpen = (filePath, fileName, content) => {
    setConfirmationHandler(() => () => openSimFile(filePath, content));
    setConfirmationModalOpen(true);
  }

  const handleNewFile = () => {
    setHasUnsavedChanges(hasUnsavedChanges => {
      if (hasUnsavedChanges) {
        setSaveConfirmationModalOpen(true);
      } else {
        resetFile();
      }
    });
  };

  const resetFile = () => {
    setSimulationInput(initSimulationInput);
    setTaskList(flattenedInitTasks);
    setComponentList(systemComponents);
    setDependencyList(systemDependencies);
    setEvaluator(systemEvaluator);
    setConstraints(systemConstraints);
    setActiveStep('Scenario');
    setSaveConfirmationModalOpen(false);
    setFilePath('');
    setHasUnsavedChanges(false);
    if (window.electronApi) {
      window.electronApi.resetCurrentFile();
    }
  }

  const handleFileDownload = async (fileType) => {
    if (fileType === 'CSV') {
      downloadCSV(setTaskList); // Downloads from front end (change to back end later?)
    } else {
      return await buildDownloadJSON(fileType, setStateMethods);  // Downloads from back end
    }
  };

  const handleSaveReset = () => {
    handleSaveFile(resetFile);
  }

  const handleDontSaveReset = () => {
    resetFile();
  }

  // Called when user confirms file selection
  const handleUploadConfirm = (fileType, filePath, fileName, content) => {
    // Parse file content
    try {
      switch(fileType) {
        case 'Scenario':
          parseJSONFile(fileType, content, setStateMethods);
          break;
        case 'Tasks':
          parseJSONFile(fileType, content, setStateMethods);
          break;
        case 'System Model':
          const { systemComponents, systemDependencies } = parseJSONFile(fileType, content, setStateMethods);
          updateModelNodesEdges(systemComponents, systemDependencies);
          updateDependencyNodes(systemComponents, systemDependencies);
          break;
        case 'CSV':
          parseCSVFile(content, setTaskList);
          break;
        default:
          throw new Error('Invalid file type');
      }
    } catch (error) {
      // If error, display error modal
      setErrorMessage(error.message);
      setErrorModalOpen(true);
    } finally {
      // Always close modal and reset selected file
      setConfirmationModalOpen(false);
      setConfirmationHandler(() => {});
    }
  }

  // Called when user cancels file selection
  const handleUploadCancel = () => {
    // Close modal and reset selected file
    setConfirmationModalOpen(false);
    setConfirmationHandler(() => {});
  }

  const openSimFile = (filePath, content) => {
    try {
      parseSimFile(content, savedStateMethods);
      setFilePath(filePath);
      setHasUnsavedChanges(false);
      window.electronApi.confirmFileOpened(filePath, content);
    } catch (error) {
      // If error, display error modal
      setErrorMessage(error.message);
      setErrorModalOpen(true);
    } finally {
      // Always close modal and reset selected file
      setConfirmationModalOpen(false);
      setConfirmationHandler(() => {});
      setActiveStep('Scenario');
    }
  }

  const handleSaveFile = async (callback, updateCache = false) => {
    if (window.electronApi) {
      const content = buildSimFile(savedStateMethods);
      window.electronApi.saveCurrentFile(content, updateCache);
      window.electronApi.onSaveConfirm(setFilePath, setHasUnsavedChanges, callback);
    }
  };

  const handleFileUpdate = (fileUpdateStatus) => {
    setHasUnsavedChanges(fileUpdateStatus);
    if (window.electronApi) {
      window.electronApi.hasUnsavedChanges(fileUpdateStatus);
    }
  }

  const updateModelNodesEdges = (componentList, dependencyList) => {
    const { initialNodes, initialEdges } = createModelNodesEdges(componentList, dependencyList);
    setModelNodes(initialNodes);
    setModelEdges(initialEdges);
  }

  const updateDependencyNodes = (componentList, dependencyList) => {
    const { initialDependencyNodes } = createDependencyNodesEdges(componentList, dependencyList);
    setDependencyNodes(initialDependencyNodes);
  }

  useEffect(() => {
    // If running in Electron, register event handlers for menu bar file selection
    if (window.electronApi) {
      window.electronApi.onNewFile(handleNewFile);
      window.electronApi.onFileOpen(handleFileOpen);
      window.electronApi.onFileUpload(handleFileUpload);
      window.electronApi.onFileDownload(handleFileDownload);
      window.electronApi.onSaveFileClick(handleSaveFile);
      window.electronApi.onAutoSave(handleSaveFile);
      window.electronApi.onFileUpdate(handleFileUpdate);
      window.electronApi.onRevert(openSimFile);
    }
  }, []);  // Register event handlers only once: do not remove empty dependency array

  useEffect(() => {
    setHasUnsavedChanges(true);
    if (window.electronApi) {
      window.electronApi.hasUnsavedChanges(true);
    }
  }, [
    simulationInput,
    taskList,
    componentList,
    dependencyList,
    evaluator,
    constraints,
    modelNodes,
    modelEdges
  ]);

  // Update dependency nodes when component list changes
  useEffect(() => {
    updateDependencyNodes(componentList, dependencyList);
  }, [componentList]);

  // Update model nodes and edges when dependency list changes
  useEffect(() => {
    updateModelNodesEdges(componentList, dependencyList);
  }, [dependencyList]);

  return (
    <NavDrawer
      navOpen={navOpen}
      toggleNav={toggleNav}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      drawerWidth={navDrawerWidth}
      handleSaveFile={handleSaveFile}
      filePath={filePath}
      hasUnsavedChanges={hasUnsavedChanges}
      setStateMethods={setStateMethods}
    >
      <div className={`work-space ${navOpen ? 'work-space-nav-open' : 'work-space-nav-closed'}`} >
        {{'Scenario':
            <ScenarioParameters
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              simulationInput={simulationInput}
              setSimulationInput={setSimulationInput}
              setStateMethods={setStateMethods}
              componentList={componentList}
              evaluator={evaluator}
              setEvaluator={setEvaluator}
            />,
          'Tasks':
            <TaskTable
              navOpen={navOpen}
              taskList={taskList}
              setTaskList={setTaskList}
            />,
          'System Model':
            <ModelGraph
              navOpen={navOpen}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              pythonSrc={simulationInput.dependencies.pythonSrc}
              setStateMethods={setStateMethods}
              componentList={componentList}
              setComponentList={setComponentList}
              dependencyList={dependencyList}
              setDependencyList={setDependencyList}
              constraints={constraints}
              setConstraints={setConstraints}
              setEvaluator={setEvaluator}
              nodes={modelNodes}
              edges={modelEdges}
              setNodes={setModelNodes}
              setEdges={setModelEdges}
              onNodesChange={onModelNodesChange}
              onEdgesChange={onModelEdgesChange}
              modelErrors={modelErrors}
              setModelErrors={setModelErrors}
              setErrorModalOpen={setErrorModalOpen}
              setErrorMessage={setErrorMessage}
            />,
          'Dependencies':
            <DependencyGraph
              navOpen={navOpen}
              componentList={componentList}
              dependencyList={dependencyList}
              setDependencyList={setDependencyList}
              nodes={dependencyNodes}
              setNodes={setDependencyNodes}
              edges={dependencyEdges}
              setEdges={setDependencyEdges}
              onNodesChange={onDependencyNodesChange}
              onEdgesChange={onDependencyEdgesChange}
            />,
          'Constraints':
            <ConstraintsTable
              navOpen={navOpen}
              constraints={constraints}
              setConstraints={setConstraints}
              componentList={componentList}
            />,
          'Simulate': <></>,
          'Analyze': <></>
          }[activeStep]}
          {
            confirmationModalOpen && (
            <div className='stacking-context'>
              <ConfirmationModal
                title={'Overwrite parameters?'}
                message={'Are you sure you want to overwrite with current file?'}
                onConfirm={confirmationHandler}
                onCancel={handleUploadCancel}
                confirmText={'Confirm'}
                cancelText={'Cancel'}
              />
            </div>)
          }
          {
            saveConfirmationModalOpen && (
            <div className='stacking-context'>
              <SaveConfirmationModal
                onSaveConfirm={handleSaveReset}
                onDontSaveConfirm={handleDontSaveReset}
                onClose={() => setSaveConfirmationModalOpen(false)}
              />
            </div>)
          }
          {
            errorModalOpen && (
            <div className='stacking-context'>
              <ErrorModal
                title={Error}
                message={errorMessage}
                onConfirm={() => setErrorModalOpen(false)}
              />
            </div>)
          }
      <Footer/>
      </div>
    </NavDrawer>
  );
}

