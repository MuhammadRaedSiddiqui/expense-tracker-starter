function FormSelect({ value, onChange, options, defaultLabel }) {
  return (
    <select value={value} onChange={onChange}>
      {defaultLabel && <option value="">{defaultLabel}</option>}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default FormSelect;
