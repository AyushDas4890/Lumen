import type {ReactNode} from 'react';
import {Breadcrumbs, BreadcrumbItem} from '@astryxdesign/core/Breadcrumbs';

/** Page header: breadcrumb trail, title and an optional one-line intro. */
export function PageHead({trail, title, children}: {trail: {label: string; href?: string}[]; title: string; children?: ReactNode}) {
  return (
    <section className="pagehead">
      <div className="container">
        <Breadcrumbs variant="supporting" label="Breadcrumb">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          {trail.map((t) => <BreadcrumbItem key={t.label} href={t.href}>{t.label}</BreadcrumbItem>)}
        </Breadcrumbs>
        <h1>{title}</h1>
        {children && <p className="pagehead__lead">{children}</p>}
      </div>
    </section>
  );
}
