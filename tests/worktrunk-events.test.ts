import { describe, test, expect } from "bun:test"
import type { PluginContext } from "@opencode-ai/plugin"

describe("WorkTrunk Plugin - Event Handling", () => {
  const createMockContext = (shellMock: any): Partial<PluginContext> => ({
    $: shellMock,
    client: {
      app: {
        log: async () => {},
      },
    } as any,
    project: {} as any,
    directory: "/test",
    worktree: {} as any,
  })

  test("session.status 'busy' event sets 🤖 marker", async () => {
    const pluginModule = await import("../index.ts")
    const WorkTrunkPlugin = pluginModule.default

    let markerSet = false
    let capturedMarker: string | null = null

    let callCount = 0
    const mockShell = {
      quiet: () => {
        callCount++
        if (callCount === 1) {
          return Promise.resolve({ stdout: Buffer.from("wt 1.0.0") })
        }
        if (callCount === 2) {
          return Promise.resolve({ stdout: Buffer.from("main") })
        }
        return Promise.resolve({ stdout: Buffer.from("") })
      },
    }

    const mock$ = ((strings: TemplateStringsArray, ...values: any[]) => {
      const cmd = strings.join("")
      if (cmd.includes("wt config state marker set")) {
        markerSet = true
        if (values.length > 0) {
          capturedMarker = values[0]
        }
      }
      return mockShell
    }) as any

    const mockContext = createMockContext(mock$)
    const plugin = await WorkTrunkPlugin(mockContext as PluginContext)

    await plugin.event!({
      event: {
        type: "session.status",
        properties: {
          sessionID: "test-session",
          status: { type: "busy" },
        },
      },
    } as any)

    await new Promise((resolve) => setTimeout(resolve, 250))

    expect(markerSet).toBe(true)
    expect(capturedMarker).toBe("🤖")
  })

  test("session.status 'idle' event sets 💬 marker", async () => {
    const pluginModule = await import("../index.ts")
    const WorkTrunkPlugin = pluginModule.default

    let markerSet = false
    let capturedMarker: string | null = null

    let callCount = 0
    const mockShell = {
      quiet: () => {
        callCount++
        if (callCount === 1) {
          return Promise.resolve({ stdout: Buffer.from("wt 1.0.0") })
        }
        if (callCount === 2) {
          return Promise.resolve({ stdout: Buffer.from("main") })
        }
        return Promise.resolve({ stdout: Buffer.from("") })
      },
    }

    const mock$ = ((strings: TemplateStringsArray, ...values: any[]) => {
      const cmd = strings.join("")
      if (cmd.includes("wt config state marker set")) {
        markerSet = true
        if (values.length > 0) {
          capturedMarker = values[0]
        }
      }
      return mockShell
    }) as any

    const mockContext = createMockContext(mock$)
    const plugin = await WorkTrunkPlugin(mockContext as PluginContext)

    await plugin.event!({
      event: {
        type: "session.status",
        properties: {
          sessionID: "test-session",
          status: { type: "idle" },
        },
      },
    } as any)

    await new Promise((resolve) => setTimeout(resolve, 250))

    expect(markerSet).toBe(true)
    expect(capturedMarker).toBe("💬")
  })

  test("session.created event sets 💬 marker", async () => {
    const pluginModule = await import("../index.ts")
    const WorkTrunkPlugin = pluginModule.default

    let markerSet = false
    let capturedMarker: string | null = null

    let callCount = 0
    const mockShell = {
      quiet: () => {
        callCount++
        if (callCount === 1) {
          return Promise.resolve({ stdout: Buffer.from("wt 1.0.0") })
        }
        if (callCount === 2) {
          return Promise.resolve({ stdout: Buffer.from("main") })
        }
        return Promise.resolve({ stdout: Buffer.from("") })
      },
    }

    const mock$ = ((strings: TemplateStringsArray, ...values: any[]) => {
      const cmd = strings.join("")
      if (cmd.includes("wt config state marker set")) {
        markerSet = true
        if (values.length > 0) {
          capturedMarker = values[0]
        }
      }
      return mockShell
    }) as any

    const mockContext = createMockContext(mock$)
    const plugin = await WorkTrunkPlugin(mockContext as PluginContext)

    await plugin.event!({
      event: {
        type: "session.created",
        properties: {
          info: {
            id: "test-session",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      },
    } as any)

    await new Promise((resolve) => setTimeout(resolve, 250))

    expect(markerSet).toBe(true)
    expect(capturedMarker).toBe("💬")
  })

  test("session.idle event clears marker", async () => {
    const pluginModule = await import("../index.ts")
    const WorkTrunkPlugin = pluginModule.default

    let markerCleared = false
    let capturedMarker: string | null = null

    let callCount = 0
    const mockShell = {
      quiet: () => {
        callCount++
        if (callCount === 1) {
          return Promise.resolve({ stdout: Buffer.from("wt 1.0.0") })
        }
        if (callCount === 2) {
          return Promise.resolve({ stdout: Buffer.from("main") })
        }
        return Promise.resolve({ stdout: Buffer.from("") })
      },
    }

    const mock$ = ((strings: TemplateStringsArray, ...values: any[]) => {
      const cmd = strings.join("")
      if (cmd.includes("wt config state marker set")) {
        markerCleared = true
        // Extract marker from command: marker set "X" or marker set ""
        const match = cmd.match(/marker set "([^"]*)"/)
        if (match) {
          capturedMarker = match[1]
        }
      }
      return mockShell
    }) as any

    const mockContext = createMockContext(mock$)
    const plugin = await WorkTrunkPlugin(mockContext as PluginContext)

    await plugin.event!({
      event: {
        type: "session.idle",
        properties: {
          sessionID: "test-session",
        },
      },
    } as any)

    await new Promise((resolve) => setTimeout(resolve, 250))

    expect(markerCleared).toBe(true)
    expect(capturedMarker).toBe("")
  })

  test("session.error event clears marker", async () => {
    const pluginModule = await import("../index.ts")
    const WorkTrunkPlugin = pluginModule.default

    let markerCleared = false
    let capturedMarker: string | null = null

    let callCount = 0
    const mockShell = {
      quiet: () => {
        callCount++
        if (callCount === 1) {
          return Promise.resolve({ stdout: Buffer.from("wt 1.0.0") })
        }
        if (callCount === 2) {
          return Promise.resolve({ stdout: Buffer.from("main") })
        }
        return Promise.resolve({ stdout: Buffer.from("") })
      },
    }

    const mock$ = ((strings: TemplateStringsArray, ...values: any[]) => {
      const cmd = strings.join("")
      if (cmd.includes("wt config state marker set")) {
        markerCleared = true
        // Extract marker from command: marker set "X" or marker set ""
        const match = cmd.match(/marker set "([^"]*)"/)
        if (match) {
          capturedMarker = match[1]
        }
      }
      return mockShell
    }) as any

    const mockContext = createMockContext(mock$)
    const plugin = await WorkTrunkPlugin(mockContext as PluginContext)

    await plugin.event!({
      event: {
        type: "session.error",
        properties: {
          sessionID: "test-session",
          error: new Error("Test error"),
        },
      },
    } as any)

    await new Promise((resolve) => setTimeout(resolve, 250))

    expect(markerCleared).toBe(true)
    expect(capturedMarker).toBe("")
  })

  test("session.status 'retry' event clears marker", async () => {
    const pluginModule = await import("../index.ts")
    const WorkTrunkPlugin = pluginModule.default

    let markerCleared = false
    let capturedMarker: string | null = null

    let callCount = 0
    const mockShell = {
      quiet: () => {
        callCount++
        if (callCount === 1) {
          return Promise.resolve({ stdout: Buffer.from("wt 1.0.0") })
        }
        if (callCount === 2) {
          return Promise.resolve({ stdout: Buffer.from("main") })
        }
        return Promise.resolve({ stdout: Buffer.from("") })
      },
    }

    const mock$ = ((strings: TemplateStringsArray, ...values: any[]) => {
      const cmd = strings.join("")
      if (cmd.includes("wt config state marker set")) {
        markerCleared = true
        // Extract marker from command: marker set "X" or marker set ""
        const match = cmd.match(/marker set "([^"]*)"/)
        if (match) {
          capturedMarker = match[1]
        }
      }
      return mockShell
    }) as any

    const mockContext = createMockContext(mock$)
    const plugin = await WorkTrunkPlugin(mockContext as PluginContext)

    await plugin.event!({
      event: {
        type: "session.status",
        properties: {
          sessionID: "test-session",
          status: {
            type: "retry",
            attempt: 1,
            message: "Retrying...",
            next: 1000,
          },
        },
      },
    } as any)

    await new Promise((resolve) => setTimeout(resolve, 250))

    expect(markerCleared).toBe(true)
    expect(capturedMarker).toBe("")
  })

  test("cleanup clears all timers and prevents initialization", async () => {
    const pluginModule = await import("../index.ts")
    const WorkTrunkPlugin = pluginModule.default

    let initCalled = false
    let intervalStarted = false

    const mockShell = {
      quiet: () => {
        return Promise.resolve({ stdout: Buffer.from("main") })
      },
    }

    const mock$ = ((strings: TemplateStringsArray, ...values: any[]) => {
      const cmd = strings.join("")
      // Track if initialization runs
      if (cmd.includes("wt --version")) {
        initCalled = true
      }
      if (cmd.includes("git rev-parse")) {
        initCalled = true
      }
      return mockShell
    }) as any

    const mockContext = createMockContext(mock$)
    const plugin = await WorkTrunkPlugin(mockContext as PluginContext)

    expect(plugin.cleanup).toBeDefined()
    expect(typeof plugin.cleanup).toBe("function")

    // Call cleanup immediately to cancel the 100ms initialization timer
    plugin.cleanup!()

    // Wait for the original initialization window (100ms) plus buffer
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Verify initialization was cancelled - no calls should have been made
    expect(initCalled).toBe(false)

    // Cleanup is idempotent - should not throw
    plugin.cleanup!()
  })

  test("status updates are debounced", async () => {
    const pluginModule = await import("../index.ts")
    const WorkTrunkPlugin = pluginModule.default

    let markerSetCount = 0

    let callCount = 0
    const mockShell = {
      quiet: () => {
        callCount++
        if (callCount === 1) {
          return Promise.resolve({ stdout: Buffer.from("wt 1.0.0") })
        }
        if (callCount === 2) {
          return Promise.resolve({ stdout: Buffer.from("main") })
        }
        return Promise.resolve({ stdout: Buffer.from("") })
      },
    }

    const mock$ = ((strings: TemplateStringsArray, ...values: any[]) => {
      const cmd = strings.join("")
      if (cmd.includes("wt config state marker set")) {
        markerSetCount++
      }
      return mockShell
    }) as any

    const mockContext = createMockContext(mock$)
    const plugin = await WorkTrunkPlugin(mockContext as PluginContext)

    for (let i = 0; i < 5; i++) {
      await plugin.event!({
        event: {
          type: "session.status",
          properties: {
            sessionID: "test-session",
            status: { type: "busy" },
          },
        },
      } as any)
    }

    await new Promise((resolve) => setTimeout(resolve, 250))

    expect(markerSetCount).toBe(1)
  })

  test("final state wins: busy->idle transition results in 💬", async () => {
    const pluginModule = await import("../index.ts")
    const WorkTrunkPlugin = pluginModule.default

    const markers: string[] = []

    let callCount = 0
    const mockShell = {
      quiet: () => {
        callCount++
        if (callCount === 1) {
          return Promise.resolve({ stdout: Buffer.from("wt 1.0.0") })
        }
        if (callCount === 2) {
          return Promise.resolve({ stdout: Buffer.from("main") })
        }
        return Promise.resolve({ stdout: Buffer.from("") })
      },
    }

    const mock$ = ((strings: TemplateStringsArray, ...values: any[]) => {
      // Reconstruct the full command from template strings and values
      let cmd = strings[0] || ""
      for (let i = 0; i < values.length; i++) {
        cmd += String(values[i]) + (strings[i + 1] || "")
      }
      if (cmd.includes("wt config state marker set")) {
        const match = cmd.match(/marker set "([^"]*)"/)
        if (match) {
          markers.push(match[1])
        }
      }
      return mockShell
    }) as any

    const mockContext = createMockContext(mock$)
    const plugin = await WorkTrunkPlugin(mockContext as PluginContext)

    // Send busy then immediately idle
    await plugin.event!({
      event: {
        type: "session.status",
        properties: {
          sessionID: "test-session",
          status: { type: "busy" },
        },
      },
    } as any)

    await plugin.event!({
      event: {
        type: "session.status",
        properties: {
          sessionID: "test-session",
          status: { type: "idle" },
        },
      },
    } as any)

    await new Promise((resolve) => setTimeout(resolve, 250))

    // Should only have one call with the final state (idle -> 💬)
    expect(markers.length).toBe(1)
    expect(markers[0]).toBe("💬")
  })

  test("final state wins: created->busy transition results in 🤖", async () => {
    const pluginModule = await import("../index.ts")
    const WorkTrunkPlugin = pluginModule.default

    const markers: string[] = []

    let callCount = 0
    const mockShell = {
      quiet: () => {
        callCount++
        if (callCount === 1) {
          return Promise.resolve({ stdout: Buffer.from("wt 1.0.0") })
        }
        if (callCount === 2) {
          return Promise.resolve({ stdout: Buffer.from("main") })
        }
        return Promise.resolve({ stdout: Buffer.from("") })
      },
    }

    const mock$ = ((strings: TemplateStringsArray, ...values: any[]) => {
      // Reconstruct the full command from template strings and values
      let cmd = strings[0] || ""
      for (let i = 0; i < values.length; i++) {
        cmd += String(values[i]) + (strings[i + 1] || "")
      }
      if (cmd.includes("wt config state marker set")) {
        const match = cmd.match(/marker set "([^"]*)"/)
        if (match) {
          markers.push(match[1])
        }
      }
      return mockShell
    }) as any

    const mockContext = createMockContext(mock$)
    const plugin = await WorkTrunkPlugin(mockContext as PluginContext)

    // Send created then immediately busy
    await plugin.event!({
      event: {
        type: "session.created",
        properties: {
          info: {
            id: "test-session",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      },
    } as any)

    await plugin.event!({
      event: {
        type: "session.status",
        properties: {
          sessionID: "test-session",
          status: { type: "busy" },
        },
      },
    } as any)

    await new Promise((resolve) => setTimeout(resolve, 250))

    // Should only have one call with the final state (busy -> 🤖)
    expect(markers.length).toBe(1)
    expect(markers[0]).toBe("🤖")
  })

  test("marker set failure does not throw and logs debug", async () => {
    const pluginModule = await import("../index.ts")
    const WorkTrunkPlugin = pluginModule.default

    const logMessages: { level: string; message: string }[] = []

    let shouldFailMarkerSet = false
    const mock$ = ((strings: TemplateStringsArray, ...values: any[]) => {
      // Reconstruct the full command from template strings and values
      let cmd = strings[0] || ""
      for (let i = 0; i < values.length; i++) {
        cmd += String(values[i]) + (strings[i + 1] || "")
      }

      if (cmd.includes("wt --version")) {
        return {
          quiet: () => Promise.resolve({ stdout: Buffer.from("wt 1.0.0") }),
        } as any
      }

      if (cmd.includes("git rev-parse")) {
        return {
          quiet: () => Promise.resolve({ stdout: Buffer.from("main") }),
        } as any
      }

      if (cmd.includes("wt config state marker set")) {
        shouldFailMarkerSet = true
        return {
          quiet: () => Promise.reject(new Error("WorkTrunk not configured for this branch")),
        } as any
      }

      return {
        quiet: () => Promise.resolve({ stdout: Buffer.from("") }),
      } as any
    }) as any

    const mockContext: Partial<PluginContext> = {
      $: mock$,
      client: {
        app: {
          log: async (data: { body: { level: string; message: string } }) => {
            logMessages.push({
              level: data.body.level,
              message: data.body.message,
            })
          },
        } as any,
      },
      project: {} as any,
      directory: "/test",
      worktree: {} as any,
    }

    const plugin = await WorkTrunkPlugin(mockContext as PluginContext)

    // Should not throw even though marker set will fail
    let threwError = false
    try {
      await plugin.event!({
        event: {
          type: "session.status",
          properties: {
            sessionID: "test-session",
            status: { type: "busy" },
          },
        },
      } as any)

      await new Promise((resolve) => setTimeout(resolve, 250))
    } catch (e) {
      threwError = true
    }

    expect(threwError).toBe(false)
    expect(shouldFailMarkerSet).toBe(true)

    // Should have logged the failure at debug level
    const debugLogs = logMessages.filter((log) => log.level === "debug")
    expect(debugLogs.length).toBeGreaterThan(0)
    expect(debugLogs.some((log) => log.message.includes("Failed to set status marker"))).toBe(true)
  })

  test("does not attempt to write marker when not in git repo", async () => {
    const pluginModule = await import("../index.ts")
    const WorkTrunkPlugin = pluginModule.default

    let markerSetAttempted = false

    const mock$ = ((strings: TemplateStringsArray, ...values: any[]) => {
      // Reconstruct the full command from template strings and values
      let cmd = strings[0] || ""
      for (let i = 0; i < values.length; i++) {
        cmd += String(values[i]) + (strings[i + 1] || "")
      }

      if (cmd.includes("wt --version")) {
        return {
          quiet: () => Promise.resolve({ stdout: Buffer.from("wt 1.0.0") }),
        } as any
      }

      if (cmd.includes("git rev-parse")) {
        // Simulate not being in a git repo
        return {
          quiet: () => Promise.reject(new Error("fatal: not a git repository")),
        } as any
      }

      if (cmd.includes("wt config state marker set")) {
        markerSetAttempted = true
        return {
          quiet: () => Promise.resolve({ stdout: Buffer.from("") }),
        } as any
      }

      return {
        quiet: () => Promise.resolve({ stdout: Buffer.from("") }),
      } as any
    }) as any

    const mockContext = createMockContext(mock$)
    const plugin = await WorkTrunkPlugin(mockContext as PluginContext)

    // Send a busy event
    await plugin.event!({
      event: {
        type: "session.status",
        properties: {
          sessionID: "test-session",
          status: { type: "busy" },
        },
      },
    } as any)

    await new Promise((resolve) => setTimeout(resolve, 250))

    // Should not have attempted to set marker since no branch was detected
    expect(markerSetAttempted).toBe(false)
  })
})
