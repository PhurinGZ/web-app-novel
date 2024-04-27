import React, { useState } from "react";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { animals } from "@/data/dataAutoConplete";

interface Animal {
  value: string;
  label: string;
  description: string;
}


const App: React.FC = () => {

  const [selected,setSelected] = useState<Animal | null>();

  const handleClick = () =>{
    console.log(selected)
  }

  return (
    <div className="flex">
      <Autocomplete
        allowsCustomValue
        label="Search an novel"
        variant="bordered"
        className="max-w-xs"
        defaultItems={animals}
        onInputChange={(value) => setSelected(value)}
      >
        {(item: Animal) => (
          <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
        )}
      </Autocomplete>

      <Button color="warning" size="lg" onClick={handleClick} className="h-full">Search</Button>
    </div>
  );
};

export default App;
