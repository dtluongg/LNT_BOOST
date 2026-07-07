USE [master]
GO
/****** Object:  Database [LNTBOOST]    Script Date: 7/7/2026 3:10:26 PM ******/
CREATE DATABASE [LNTBOOST]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'LNTBOOST', FILENAME = N'D:\LNTBOOSTDB\LNTBOOST.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'LNTBOOST_log', FILENAME = N'D:\LNTBOOSTDB\LNTBOOST_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [LNTBOOST] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [LNTBOOST].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [LNTBOOST] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [LNTBOOST] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [LNTBOOST] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [LNTBOOST] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [LNTBOOST] SET ARITHABORT OFF 
GO
ALTER DATABASE [LNTBOOST] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [LNTBOOST] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [LNTBOOST] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [LNTBOOST] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [LNTBOOST] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [LNTBOOST] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [LNTBOOST] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [LNTBOOST] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [LNTBOOST] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [LNTBOOST] SET  DISABLE_BROKER 
GO
ALTER DATABASE [LNTBOOST] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [LNTBOOST] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [LNTBOOST] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [LNTBOOST] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [LNTBOOST] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [LNTBOOST] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [LNTBOOST] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [LNTBOOST] SET RECOVERY FULL 
GO
ALTER DATABASE [LNTBOOST] SET  MULTI_USER 
GO
ALTER DATABASE [LNTBOOST] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [LNTBOOST] SET DB_CHAINING OFF 
GO
ALTER DATABASE [LNTBOOST] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [LNTBOOST] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [LNTBOOST] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [LNTBOOST] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [LNTBOOST] SET QUERY_STORE = OFF
GO
USE [LNTBOOST]
GO
/****** Object:  Table [dbo].[tblCompanyInformation]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblCompanyInformation](
	[CompanyID] [nvarchar](5) NOT NULL,
	[CompanyCode] [nvarchar](10) NULL,
	[CompanyName] [nvarchar](200) NULL,
	[AddressLine1] [nvarchar](500) NULL,
	[AddressLine2] [nvarchar](500) NULL,
	[City] [nvarchar](100) NULL,
	[Province] [nvarchar](100) NULL,
	[PostalCode] [nvarchar](50) NULL,
	[CountryCode] [nvarchar](5) NULL,
	[Telephone] [nvarchar](50) NULL,
	[Fax] [nvarchar](50) NULL,
	[Email] [nvarchar](50) NULL,
	[PrimaryCurrencyCode] [nvarchar](5) NULL,
	[SecondaryCurrencyCode] [nvarchar](5) NULL,
	[CompanyTypeCode] [nvarchar](5) NULL,
	[TAXCode] [nvarchar](100) NULL,
	[ActiveFlag] [bit] NULL,
 CONSTRAINT [PK_tblCompanyInformation] PRIMARY KEY CLUSTERED 
(
	[CompanyID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblCompanyModuleMaster]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblCompanyModuleMaster](
	[CompanySiteID] [nvarchar](5) NOT NULL,
	[ModuleMasterID] [nvarchar](5) NOT NULL,
 CONSTRAINT [PK_tblCompanyModuleMaster] PRIMARY KEY CLUSTERED 
(
	[CompanySiteID] ASC,
	[ModuleMasterID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblCompanySiteInformation]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblCompanySiteInformation](
	[CompanySiteID] [nvarchar](5) NOT NULL,
	[CompanyID] [nvarchar](5) NOT NULL,
	[SiteCode] [nvarchar](10) NOT NULL,
	[SiteName] [nvarchar](200) NOT NULL,
	[AddressLine1] [nvarchar](500) NOT NULL,
	[AddressLine2] [nvarchar](500) NULL,
	[City] [nvarchar](100) NULL,
	[Province] [nvarchar](100) NULL,
	[PostalCode] [nvarchar](50) NULL,
	[CountryCode] [nvarchar](5) NULL,
	[Telephone] [nvarchar](50) NULL,
	[Fax] [nvarchar](50) NULL,
	[Email] [nvarchar](50) NULL,
	[PrimaryCurrencyCode] [nvarchar](5) NULL,
	[SecondaryCurrencyCode] [nvarchar](5) NULL,
	[CompanyTypeCode] [nvarchar](5) NULL,
	[TAXCode] [nvarchar](100) NULL,
	[ActiveFlag] [bit] NOT NULL,
 CONSTRAINT [PK_tblCompanySiteInformation] PRIMARY KEY CLUSTERED 
(
	[CompanySiteID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblCompanySiteUserLoginDetails]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblCompanySiteUserLoginDetails](
	[Username] [nvarchar](20) NOT NULL,
	[CompanySiteID] [nvarchar](5) NOT NULL,
 CONSTRAINT [PK_tblMastUserCompany] PRIMARY KEY CLUSTERED 
(
	[Username] ASC,
	[CompanySiteID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblCountryMaster]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblCountryMaster](
	[CountryID] [nvarchar](2) NOT NULL,
	[CountryName] [nvarchar](200) NULL,
	[ActiveFlag] [bit] NULL,
 CONSTRAINT [PK_tblCountryMaster] PRIMARY KEY CLUSTERED 
(
	[CountryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblCurrencyMaster]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblCurrencyMaster](
	[CurrencyCode] [nvarchar](5) NOT NULL,
	[Description] [nvarchar](50) NULL,
	[ActiveFlag] [bit] NULL,
 CONSTRAINT [PK_tblCurrencyMaster] PRIMARY KEY CLUSTERED 
(
	[CurrencyCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblMastUser]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblMastUser](
	[Username] [nvarchar](20) NOT NULL,
	[FullName] [nvarchar](250) NULL,
	[Password] [nvarchar](200) NULL,
	[Email] [nvarchar](150) NULL,
	[Phone] [varchar](20) NULL,
	[Authorized] [bit] NULL,
	[Admin] [bit] NULL,
	[CreatedTime] [datetime] NULL,
	[LastUpdatePW] [datetime] NULL,
	[IsNewUser] [bit] NULL,
	[VPN_UserName] [nvarchar](100) NULL,
	[VPN_DomainName] [nvarchar](100) NULL,
	[DefaultCompanyID] [nvarchar](5) NULL,
	[RefreshToken] [nvarchar](100) NULL,
	[RefreshTokenExpiryTime] [nvarchar](100) NULL,
 CONSTRAINT [PK_tblMastUser] PRIMARY KEY CLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblMenuFilters]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblMenuFilters](
	[MenuFilterID] [int] NOT NULL,
	[MenuFilterName] [nvarchar](50) NOT NULL,
	[ActiveFlag] [bit] NOT NULL,
 CONSTRAINT [PK_tblMenuFilters] PRIMARY KEY CLUSTERED 
(
	[MenuFilterID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblMenuFunctions]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblMenuFunctions](
	[ModuleMasterID] [nvarchar](5) NOT NULL,
	[MenuGroupID] [int] NOT NULL,
	[MenuFunctionID] [int] NOT NULL,
	[MenuFunctionName] [nvarchar](50) NOT NULL,
	[MenuFilterID] [int] NOT NULL,
	[ActiveFlag] [bit] NOT NULL,
 CONSTRAINT [PK_tblMenuFunctions] PRIMARY KEY CLUSTERED 
(
	[ModuleMasterID] ASC,
	[MenuGroupID] ASC,
	[MenuFunctionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblMenuGroupFilters]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblMenuGroupFilters](
	[ModuleMasterID] [nvarchar](5) NOT NULL,
	[MenuGroupID] [int] NOT NULL,
	[MenuFilterID] [int] NOT NULL,
 CONSTRAINT [PK_tblMenuGroupFilters] PRIMARY KEY CLUSTERED 
(
	[ModuleMasterID] ASC,
	[MenuGroupID] ASC,
	[MenuFilterID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblMenuGroups]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblMenuGroups](
	[ModuleMasterID] [nvarchar](5) NOT NULL,
	[MenuGroupID] [int] NOT NULL,
	[MenuGroupName] [nvarchar](50) NOT NULL,
	[ActiveFlag] [bit] NOT NULL,
 CONSTRAINT [PK_tblMenuGroups] PRIMARY KEY CLUSTERED 
(
	[ModuleMasterID] ASC,
	[MenuGroupID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblModuleMaster]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblModuleMaster](
	[ModuleMasterID] [nvarchar](5) NOT NULL,
	[ModuleMasterName] [nvarchar](50) NOT NULL,
	[ActiveFlag] [bit] NOT NULL,
 CONSTRAINT [PK_tblModuleMaster] PRIMARY KEY CLUSTERED 
(
	[ModuleMasterID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblModuleMasterUsers]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblModuleMasterUsers](
	[CompanySiteID] [nvarchar](5) NOT NULL,
	[ModuleMasterID] [nvarchar](5) NOT NULL,
	[Username] [nvarchar](20) NOT NULL,
 CONSTRAINT [PK_tblModuleMasterUsers] PRIMARY KEY CLUSTERED 
(
	[CompanySiteID] ASC,
	[ModuleMasterID] ASC,
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblPaymentTypeMaster]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblPaymentTypeMaster](
	[PaymentTypeCode] [nvarchar](10) NOT NULL,
	[PaymentTypeName] [nvarchar](200) NOT NULL,
	[ActiveFlag] [bit] NOT NULL,
	[CreditDays] [int] NOT NULL,
	[Remarks] [nvarchar](200) NULL,
 CONSTRAINT [PK_tblPaymentTypeMaster] PRIMARY KEY CLUSTERED 
(
	[PaymentTypeCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblUserQuickAccessMenu]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblUserQuickAccessMenu](
	[ModuleMasterID] [nvarchar](5) NOT NULL,
	[MenuGroupID] [int] NOT NULL,
	[MenuFunctionID] [int] NOT NULL,
	[CompanyID] [nvarchar](5) NOT NULL,
	[Username] [nvarchar](20) NOT NULL,
 CONSTRAINT [PK_tblUserQuickAccessMenu] PRIMARY KEY CLUSTERED 
(
	[ModuleMasterID] ASC,
	[MenuGroupID] ASC,
	[MenuFunctionID] ASC,
	[CompanyID] ASC,
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblVendorDetail]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblVendorDetail](
	[VendorID] [nvarchar](10) NOT NULL,
	[VendorCode] [nvarchar](30) NULL,
	[VendorName] [nvarchar](200) NULL,
	[VendorGroupCode] [nvarchar](5) NULL,
	[VendorCertificate] [nvarchar](200) NULL,
	[CompanyName] [nvarchar](200) NULL,
	[PhoneNo] [nvarchar](50) NULL,
	[Fax] [nvarchar](50) NULL,
	[WebSite] [nvarchar](200) NULL,
	[AddressLine1] [nvarchar](500) NULL,
	[AddressLine2] [nvarchar](500) NULL,
	[City] [nvarchar](50) NULL,
	[Province] [nvarchar](50) NULL,
	[Postalcode] [nvarchar](50) NULL,
	[CountryID] [nvarchar](2) NULL,
	[VendorClassID] [nvarchar](50) NULL,
	[MainContactPersonTitle] [nvarchar](10) NULL,
	[MainContactPersonName] [nvarchar](100) NULL,
	[MainContactPersonPosition] [nvarchar](100) NULL,
	[MainContactPersonPhoneNo1] [nvarchar](50) NULL,
	[MainContactPersonPhoneNo2] [nvarchar](50) NULL,
	[MainContactPersonEmail] [nvarchar](200) NULL,
	[DefaultCurrencyCode] [nvarchar](5) NULL,
	[DefaultPaymentTypeCode] [nvarchar](10) NULL,
	[PaymentReference] [nvarchar](200) NULL,
	[RemittanceContactSameasMainContact] [bit] NULL,
	[RemittanceContactPersonTitle] [nvarchar](10) NULL,
	[RemittanceContactPersonName] [nvarchar](100) NULL,
	[RemittanceContactPersonPosition] [nvarchar](100) NULL,
	[RemittanceContactPersonPhoneNo1] [nvarchar](50) NULL,
	[RemittanceContactPersonPhoneNo2] [nvarchar](50) NULL,
	[RemittanceContactPersonEmail] [nvarchar](200) NULL,
	[Activeflag] [bit] NULL,
 CONSTRAINT [PK_tblVendorDetail] PRIMARY KEY CLUSTERED 
(
	[VendorID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblVendorGroupDetail]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblVendorGroupDetail](
	[VendorGroupCode] [nvarchar](5) NOT NULL,
	[ItemGroupCode] [nvarchar](2) NOT NULL,
	[ItemTypeCode] [nvarchar](2) NOT NULL,
	[ItemCategoryCode] [nvarchar](3) NOT NULL,
	[ActiveFlag] [bit] NULL,
 CONSTRAINT [PK_tblVendorGroupDetail] PRIMARY KEY CLUSTERED 
(
	[VendorGroupCode] ASC,
	[ItemGroupCode] ASC,
	[ItemTypeCode] ASC,
	[ItemCategoryCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblVendorGroupHeader]    Script Date: 7/7/2026 3:10:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblVendorGroupHeader](
	[VendorGroupCode] [nvarchar](5) NOT NULL,
	[VendorGroupName] [nvarchar](200) NULL,
	[MaterialSupplyFlag] [bit] NULL,
	[ServiceSupplyFlag] [bit] NULL,
	[ActiveFlag] [bit] NULL,
 CONSTRAINT [PK_tblVendorGroupHeader] PRIMARY KEY CLUSTERED 
(
	[VendorGroupCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[tblCompanyInformation] ADD  CONSTRAINT [DF_tblCompanyInformation_ActiveFlag]  DEFAULT ((1)) FOR [ActiveFlag]
GO
ALTER TABLE [dbo].[tblCountryMaster] ADD  CONSTRAINT [DF_tblCountryMaster_ActiveFlag]  DEFAULT ((1)) FOR [ActiveFlag]
GO
ALTER TABLE [dbo].[tblCurrencyMaster] ADD  CONSTRAINT [DF_tblCurrencyMaster_ActiveFlag]  DEFAULT ((1)) FOR [ActiveFlag]
GO
ALTER TABLE [dbo].[tblMastUser] ADD  CONSTRAINT [DF_tblMastUser_IsNewUser]  DEFAULT ((1)) FOR [IsNewUser]
GO
ALTER TABLE [dbo].[tblPaymentTypeMaster] ADD  CONSTRAINT [DF_tblPaymentTypeMaster_ActiveFlag]  DEFAULT ((1)) FOR [ActiveFlag]
GO
ALTER TABLE [dbo].[tblVendorDetail] ADD  CONSTRAINT [DF_tblVendorDetail_Activeflag]  DEFAULT ((1)) FOR [Activeflag]
GO
USE [master]
GO
ALTER DATABASE [LNTBOOST] SET  READ_WRITE 
GO
