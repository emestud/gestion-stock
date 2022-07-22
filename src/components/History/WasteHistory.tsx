const WasteHistory = ({date, restaurantName, openWaste}: any) => {
  return (
    <tr onClick={openWaste}>
      <td className="select-none">{date}</td>
      <td className="select-none">{restaurantName}</td>
      <td className="badge badge-ghost badge-outline select-none">---</td>
    </tr>
  );
};

export default WasteHistory;
