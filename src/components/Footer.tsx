import PintoLogo from "@/assets/protocol/PintoLogo.svg";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { trackClick } from "@/utils/analytics";
import { cn } from "@/utils/utils";
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link as ReactLink } from "react-router-dom";
import { XTwitterIcon } from "./Icons";
import { useMobileActionBarContext } from "./MobileActionBarContext";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}

const FooterLink = ({ href, children, external = false, className = "" }: FooterLinkProps) => {
  const linkClasses = cn(
    "text-pinto-light hover:text-pinto-green-4 transition-colors duration-200 text-xs sm:text-xs font-medium",
    className,
  );

  const getEventName = (url: string, isExternal: boolean) => {
    if (!isExternal) return ANALYTICS_EVENTS.FOOTER.ABOUT_CLICK;
    if (url.includes("pinto.exchange")) return ANALYTICS_EVENTS.FOOTER.PINTO_EXCHANGE_CLICK;
    if (url.includes("disclosures")) return ANALYTICS_EVENTS.FOOTER.TERMS_PRIVACY_CLICK;
    return "footer_external_unknown_click";
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
        onClick={trackClick(getEventName(href, true), {
          link_type: "external",
          link_url: href,
        })}
      >
        {children}
      </a>
    );
  }

  return (
    <ReactLink to={href} className={linkClasses} onClick={trackClick(getEventName(href, false))}>
      {children}
    </ReactLink>
  );
};

interface SocialIconProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialIcon = ({ href, icon, label }: SocialIconProps) => {
  const getEventName = (url: string) => {
    if (url.includes("discord")) return ANALYTICS_EVENTS.FOOTER.DISCORD_CLICK;
    if (url.includes("x.com") || url.includes("twitter")) return ANALYTICS_EVENTS.FOOTER.TWITTER_CLICK;
    if (url.includes("github")) return ANALYTICS_EVENTS.FOOTER.GITHUB_CLICK;
    return "footer_social_unknown_click";
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-pinto-light hover:text-pinto-green-4 transition-colors duration-200"
      aria-label={label}
      onClick={trackClick(getEventName(href), {
        link_type: "social",
        link_url: href,
        social_platform: label.toLowerCase(),
      })}
    >
      {icon}
    </a>
  );
};

export default function Footer({ landingPageVersion }: { landingPageVersion?: boolean }) {
  const { isMobileActionBarVisible } = useMobileActionBarContext();

  return (
    <footer
      className={cn(
        "border-t border-pinto-gray-2 bg-gradient-light mt-auto",
        isMobileActionBarVisible ? "pb-[4.5rem]" : "pb-0",
      )}
      id="pinto-footer"
    >
      <div className="w-full px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          {/* Links Section - Bottom Left Corner */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <img src={PintoLogo} alt="Pinto Logo" className="h-4 mb-0.5" />
            <FooterLink href="/?fromNav=true">About</FooterLink>
            <FooterLink href="https://docs.pinto.money/disclosures" external>
              {landingPageVersion ? "Disclosures" : "Terms & Privacy"}
            </FooterLink>
            {!landingPageVersion && (
              <FooterLink href="https://pinto.exchange/" external className="pinto-exchange-link">
                Pinto Exchange
              </FooterLink>
            )}
          </div>

          {/* Social Icons Section - Bottom Right Corner */}
          <div className="flex items-center gap-3 sm:ml-auto">
            <SocialIcon
              href="https://pinto.money/discord"
              icon={<DiscordLogoIcon width={16} height={16} className="sm:w-[18px] sm:h-[18px]" />}
              label="Discord"
            />
            <SocialIcon
              href="https://x.com/pintodotmoney"
              icon={<XTwitterIcon width={14} height={14} color="currentColor" />}
              label="X (Twitter)"
            />
            <SocialIcon
              href="https://github.com/pinto-org"
              icon={<GitHubLogoIcon width={16} height={16} className="sm:w-[18px] sm:h-[18px]" />}
              label="GitHub"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
