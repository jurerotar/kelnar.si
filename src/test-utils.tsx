import React, { FCWithChildren } from 'react';
import { render, renderHook } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { ViewportProvider } from 'app/providers/viewport-context';
import { composeComponents } from 'app/utils/jsx';
import { StateProvider } from 'app/providers/state-provider';

export type RenderOptions = {
  path?: string;
  queryClient?: QueryClient;
  // Wrap your component with layout(s). If property is missing, default layout will be used.
  wrapper?: FCWithChildren[] | FCWithChildren;
  deviceSize?: {
    height: Window['innerHeight'];
    width: Window['innerWidth'];
  };
};

const TestingEnvironment: FCWithChildren<RenderOptions> = (props) => {
  const { wrapper = [], deviceSize, children, queryClient: providedQueryClient } = props;

  const queryClient = providedQueryClient ?? new QueryClient();

  return (
    <StateProvider queryClient={queryClient}>
      <ViewportProvider initialSize={deviceSize}>
        {composeComponents(children, Array.isArray(wrapper) ? wrapper : [wrapper])}
      </ViewportProvider>
    </StateProvider>
  );
};

const defaultOptions: RenderOptions = {
  wrapper: [],
  deviceSize: {
    height: 0,
    width: 0,
  },
};

export const renderHookWithContext = <TProps, TResult>(callback: (props: TProps) => TResult, options?: RenderOptions) => {
  return renderHook(callback, {
    wrapper: ({ children }) => <TestingEnvironment {...{ ...defaultOptions, ...options }}>{children}</TestingEnvironment>,
  });
};

export const renderWithContext = <T = HTMLElement,>(
  ui: React.ReactElement<T, string | React.JSXElementConstructor<T>>,
  options?: RenderOptions
) => {
  return render(ui, {
    wrapper: ({ children }) => <TestingEnvironment {...{ ...defaultOptions, ...options }}>{children}</TestingEnvironment>,
  });
};
