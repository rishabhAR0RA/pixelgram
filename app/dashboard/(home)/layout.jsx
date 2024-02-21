import Header from "@/components/Header";

function HomePageLayout({ children }) {
    return (
        <div>
            <Header />
            {children}
        </div>
    );
}

export default HomePageLayout;