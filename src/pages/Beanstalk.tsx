import ReadMoreAccordion from "@/components/ReadMoreAccordion";
import { Card } from "@/components/ui/Card";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import { Link } from "react-router-dom";
import BeanstalkGlobalCard from "./beanstalk/components/BeanstalkGlobalCard";
import BeanstalkObligationsCard from "./beanstalk/components/BeanstalkObligationsCard";

const Beanstalk = () => {
  return (
    <PageContainer variant="lg">
      <div className="flex flex-col w-full mt-4 sm:mt-0">
        <div className="flex flex-col self-center w-full gap-4 mb-20 sm:mb-0 sm:gap-8">
          {/* Hero Section */}
          <div className="flex flex-col gap-y-3">
            <div className="pinto-h2 sm:pinto-h1">Beanstalk Obligations</div>
            <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
              Beanstalk Debt issued by Pinto.
            </div>
            <ReadMoreAccordion>
              <span>
                Beanstalk participants at the time of Pinto launch were issued assets based on their holdings. A portion
                of new Pinto mints go towards repaying these obligations across Beanstalk Silo Tokens, Pods, and
                Fertilizer.{" "}
                <Link
                  to="https://docs.pinto.money/appendix/old-beanstalk-holders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pinto-green-4 hover:underline"
                >
                  Learn more
                </Link>
              </span>
            </ReadMoreAccordion>
          </div>
          <Separator />

          {/* Main Cards - Two Column Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-[7fr_3fr] gap-4 sm:gap-6 sm:items-stretch justify-center">
            {/* Left Panel - Obligations Card */}
            <Card className="p-4 sm:p-6 h-full">
              <BeanstalkObligationsCard />
            </Card>

            {/* Right Panel - Global Stats Card */}
            <Card className="p-4 sm:p-6 h-full">
              <BeanstalkGlobalCard />
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Beanstalk;
