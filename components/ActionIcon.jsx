import { Button } from "./ui/button";

const ActionIcon = ({ children }) => {
    return (
        <Button
            type="submit"
            variant={"ghost"}
            size={"icon"}
            className="h-9 w-9"
        >
            {children}
        </Button>
    );
}

export default ActionIcon;