import { Button } from "@/components/ui/button";

function ActionIcon({ children, ...buttonProps }) {
    return (
        <Button
            type="submit"
            variant={"ghost"}
            size={"icon"}
            className="h-9 w-9"
            {...buttonProps}
        >
            {children}
        </Button>
    );
}

export default ActionIcon;