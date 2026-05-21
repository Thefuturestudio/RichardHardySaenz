import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";

const AboutPage = lazy(() =>
  import("./pages/AboutPage").then((module) => ({ default: module.AboutPage })),
);
const BookingPage = lazy(() =>
  import("./pages/BookingPage").then((module) => ({ default: module.BookingPage })),
);
const ArticlePage = lazy(() =>
  import("./pages/ArticlePage").then((module) => ({
    default: module.ArticlePage,
  })),
);
const EducationPage = lazy(() =>
  import("./pages/EducationPage").then((module) => ({
    default: module.EducationPage,
  })),
);
const HomePage = lazy(() =>
  import("./pages/HomePage").then((module) => ({ default: module.HomePage })),
);
const KidneyStonesPage = lazy(() =>
  import("./pages/KidneyStonesPage").then((module) => ({
    default: module.KidneyStonesPage,
  })),
);
const LegalPage = lazy(() =>
  import("./pages/LegalPage").then((module) => ({ default: module.LegalPage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })),
);
const ProcedureDetailPage = lazy(() =>
  import("./pages/ProcedureDetailPage").then((module) => ({
    default: module.ProcedureDetailPage,
  })),
);
const ProceduresPage = lazy(() =>
  import("./pages/ProceduresPage").then((module) => ({
    default: module.ProceduresPage,
  })),
);
const SpecialtiesPage = lazy(() =>
  import("./pages/SpecialtiesPage").then((module) => ({
    default: module.SpecialtiesPage,
  })),
);
const SpecialtyDetailPage = lazy(() =>
  import("./pages/SpecialtyDetailPage").then((module) => ({
    default: module.SpecialtyDetailPage,
  })),
);

export function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-mist" aria-hidden="true" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/dr-carlos-brugiati" element={<AboutPage />} />
          <Route path="/especialidades" element={<SpecialtiesPage />} />
          <Route path="/procedimientos" element={<ProceduresPage />} />
          <Route path="/calculos-renales" element={<KidneyStonesPage />} />
          <Route
            path="/ureteroscopia"
            element={<ProcedureDetailPage procedureKey="ureteroscopia" />}
          />
          <Route
            path="/laser-calculos-renales"
            element={<ProcedureDetailPage procedureKey="laserCalculos" />}
          />
          <Route
            path="/biopsia-prostata"
            element={<ProcedureDetailPage procedureKey="biopsiaProstata" />}
          />
          <Route
            path="/nefrolitotomia-percutanea"
            element={
              <ProcedureDetailPage procedureKey="nefrolitotomiaPercutanea" />
            }
          />
          <Route
            path="/cistoscopia"
            element={<ProcedureDetailPage procedureKey="cistoscopia" />}
          />
          <Route
            path="/cirugia-laparoscopica-renal"
            element={<ProcedureDetailPage procedureKey="laparoscopiaRenal" />}
          />
          <Route
            path="/holep"
            element={<ProcedureDetailPage procedureKey="holep" />}
          />
          <Route
            path="/rtup"
            element={<ProcedureDetailPage procedureKey="rtup" />}
          />
          <Route
            path="/adenectomia-prostatica"
            element={
              <ProcedureDetailPage procedureKey="adenectomiaProstatica" />
            }
          />
          <Route
            path="/ureteroscopia-flexible"
            element={
              <ProcedureDetailPage procedureKey="ureteroscopiaFlexible" />
            }
          />
          <Route
            path="/ureteroscopia-semirrigida"
            element={
              <ProcedureDetailPage procedureKey="ureteroscopiaSemirrigida" />
            }
          />
          <Route
            path="/litotricia-extracorporea"
            element={
              <ProcedureDetailPage procedureKey="litotriciaExtracorporea" />
            }
          />
          <Route
            path="/disfuncion-erectil"
            element={<ProcedureDetailPage procedureKey="disfuncionErectil" />}
          />
          <Route
            path="/vasectomia"
            element={<ProcedureDetailPage procedureKey="vasectomia" />}
          />
          <Route path="/agendar-cita" element={<BookingPage />} />
          <Route path="/educacion" element={<EducationPage />} />
          <Route
            path="/educacion/holep-crecimiento-prostatico"
            element={<ArticlePage articleKey="holepProstata" />}
          />
          <Route
            path="/educacion/calculos-renales-endourologia"
            element={<ArticlePage articleKey="calculosEndourologia" />}
          />
          <Route
            path="/educacion/segunda-opinion-uro-oncologia"
            element={<ArticlePage articleKey="segundaOpinionUroOncologia" />}
          />
          <Route
            path="/educacion/psa-biopsia-prostata"
            element={<ArticlePage articleKey="psaBiopsiaProstata" />}
          />
          <Route
            path="/educacion/vasectomia-salud-masculina"
            element={<ArticlePage articleKey="vasectomiaSaludMasculina" />}
          />
          <Route
            path="/educacion/rtup-vs-holep-prostata"
            element={<ArticlePage articleKey="rtupVsHolep" />}
          />
          <Route
            path="/educacion/sangre-en-la-orina-hematuria"
            element={<ArticlePage articleKey="sangreOrinaHematuria" />}
          />
          <Route
            path="/educacion/primera-consulta-urologica"
            element={<ArticlePage articleKey="primeraConsultaUrologica" />}
          />
          <Route
            path="/educacion/cistoscopia-preparacion"
            element={<ArticlePage articleKey="cistoscopiaPreparacion" />}
          />
          <Route
            path="/prostata"
            element={<SpecialtyDetailPage pageKey="prostata" />}
          />
          <Route
            path="/uro-oncologia"
            element={<SpecialtyDetailPage pageKey="uroOncologia" />}
          />
          <Route
            path="/endourologia"
            element={<SpecialtyDetailPage pageKey="endourologia" />}
          />
          <Route
            path="/cirugia-laparoscopica"
            element={<SpecialtyDetailPage pageKey="cirugiaLaparoscopica" />}
          />
          <Route
            path="/salud-masculina"
            element={<SpecialtyDetailPage pageKey="saludMasculina" />}
          />
          <Route
            path="/segunda-opinion"
            element={<SpecialtyDetailPage pageKey="segundaOpinion" />}
          />
          <Route path="/privacidad" element={<LegalPage type="privacy" />} />
          <Route path="/terminos" element={<LegalPage type="terms" />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
