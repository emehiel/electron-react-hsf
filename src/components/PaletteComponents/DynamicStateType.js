import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const dynStateTypeOptions = [
  "STATIC_LLA",
  "STATIC_ECI",
  "PREDETERMINED_LLA",
  "PREDETERMINED_ECI",
  "DYNAMIC_LLA",
  "DYNAMIC_ECI",
  "STATIC_LVLH",
  "NULL_STATE",
];

function DynamicStateType({ value, setComponentList, id, errors, handleBlur }) {
  const handleChange = (e) => {
    let { name, value } = e.target;

    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          return { ...component, [name]: value };
        } else {
          return component;
        }
      });
    });
  };

  return (
    <Grid item xs={6}>
      <TextField
        fullWidth
        id="dyn-state-select"
        name="dynamicStateType"
        select
        value={value.toUpperCase()}
        label="Dyn. State Type"
        onChange={handleChange}
        align="left"
        error={errors.dynamicStateType !== undefined}
        helperText={errors.dynamicStateType}
        onBlur={handleBlur}
      >
        {dynStateTypeOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );
}

export { DynamicStateType, dynStateTypeOptions };
