import {
  Container,
  SectionHeader,
  Card,
  Badge,
  DropletIcon,
  CameraIcon,
  ShieldIcon,
} from "@/components/shared";
import { prettifyEnum } from "@/lib/format";
import {
  ACTION_MATRIX,
  ACTION_META,
  CAMERA_RISK_LABEL,
  CAMERA_RISK_ORDER,
  DISEASE_THRESHOLDS,
  ENV_RISK_LABEL,
  ENV_RISK_ORDER,
} from "@/lib/decisionConfig";

const steps = [
  {
    icon: DropletIcon,
    title: "1 · Environmental risk",
    body: "Live sensor readings (temp, humidity, soil moisture) are checked against per-disease rule thresholds.",
  },
  {
    icon: CameraIcon,
    title: "2 · Camera risk",
    body: "The ML model scores disease presence from the leaf photo — low, medium or high severity.",
  },
  {
    icon: ShieldIcon,
    title: "3 · Fused action",
    body: "Both signals combine into one action: no action, alert only, spray, or spray urgently.",
  },
];

export default function DecisionEngineSection() {
  const diseases = Object.entries(DISEASE_THRESHOLDS);

  return (
    <section id="engine" className="py-20 bg-earth-50">
      <Container>
        <SectionHeader
          title="Dual-Signal Decision Engine"
          subtitle="Not just disease detection — we fuse environmental conditions with the image to decide whether to actually spray"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary-100 text-primary-600 rounded-2xl">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-semibold text-text-primary mb-1">{step.title}</h3>
                <p className="text-sm text-text-muted">{step.body}</p>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-bold text-text-primary mb-4">
              Per-disease thresholds
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-text-muted">
                    <th className="pb-2">Disease</th>
                    <th className="pb-2">Temp</th>
                    <th className="pb-2">Humidity</th>
                    <th className="pb-2">Soil moisture</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-50">
                  {diseases.map(([key, t]) => (
                    <tr key={key}>
                      <td className="py-2 pr-3 font-medium text-text-primary">
                        {prettifyEnum(key)}
                      </td>
                      <td className="py-2 pr-3 text-text-secondary">
                        {t.temp.min}–{t.temp.max}°C
                      </td>
                      <td className="py-2 pr-3 text-text-secondary">≥ {t.humidity.min}%</td>
                      <td className="py-2 text-text-secondary">
                        ≥ {t.soil_moisture.min}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-muted mt-4">
              Conditions count as “favourable” when all readable values fall inside
              the rule — that is what triggers preventive alerts.
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-text-primary mb-4">
              Risk fusion matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-separate border-spacing-1">
                <thead>
                  <tr>
                    <th className="text-left text-text-muted font-medium">Env \ Cam</th>
                    {CAMERA_RISK_ORDER.map((cam) => (
                      <th key={cam} className="text-center text-text-muted font-medium px-1">
                        {CAMERA_RISK_LABEL[cam]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ENV_RISK_ORDER.map((env) => (
                    <tr key={env}>
                      <td className="text-text-muted whitespace-nowrap pr-2">
                        {ENV_RISK_LABEL[env]}
                      </td>
                      {CAMERA_RISK_ORDER.map((cam) => {
                        const action = ACTION_MATRIX[env][cam];
                        return (
                          <td
                            key={cam}
                            className={`text-center rounded-[var(--radius-sm)] py-2 px-1 font-medium border ${ACTION_META[action].box}`}
                          >
                            {ACTION_META[action].short}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 space-y-2">
              {(Object.keys(ACTION_META) as Array<keyof typeof ACTION_META>).map(
                (action) => (
                  <div key={action} className="flex items-center gap-3">
                    <Badge variant={ACTION_META[action].variant}>
                      {ACTION_META[action].label}
                    </Badge>
                    <span className="text-xs text-text-muted">
                      {ACTION_META[action].description}
                    </span>
                  </div>
                )
              )}
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
